import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  OneToOne,
  JoinColumn,
  getRepository,
  BaseEntity,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { IsString, IsUUID, Length, validateOrReject } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

import LocationAddress from 'models/LocationAddress.model';
import LocationProfile from 'models/LocationProfile.model';
import Service from 'models/Service.model';

interface Ilocation {
  name: string;
  address: {
    street: string;
    outNumber: string;
    intNumber: string;
    neighborhood: string;
    zip: string;
    municipality: string;
    state: string;
  };
}

interface ImultipleLocations {
  id: string;
  name: string;
  owner: string;
  address: {
    municipality: string;
    state: string;
  };
  hr: {
    total: number;
    hired: number;
  };
}

@Entity({ name: 'location' })
export default class Location extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
  @IsUUID()
  id?: string;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  @IsString()
  @Length(3, 30)
  name?: string;

  @Column({ nullable: true })
  serviceId?: number;
  @ManyToOne(() => Service, (service) => service.locations)
  @JoinColumn({ name: 'serviceId' })
  service?: Service;

  @Column({ type: 'boolean', nullable: false, default: true })
  status?: boolean;

  @Column({ nullable: true })
  addressId?: string;
  @OneToOne(() => LocationAddress, { cascade: true, nullable: false })
  @JoinColumn({ name: 'addressId' })
  address?: LocationAddress;

  @OneToMany(() => LocationProfile, (profile) => profile.location)
  profiles?: LocationProfile[];

  public constructor(params?: Ilocation) {
    super();
    if (params) {
      this.name = params.name;
      this.address = new LocationAddress(params.address);
    }
  }

  public async getLocation(locationId: string) {
    if (!(uuidValidate(locationId) && uuidVersion(locationId) === 4))
      throw Error('No location');
    const location = await getRepository(Location)
      .createQueryBuilder('location')
      .select([
        'location',
        'employees.id',
        'employees.name',
        'employees.surname',
        'employees.secondSurname',
        'employees.baseWage'
      ])
      .leftJoinAndSelect('location.address', 'address')
      .leftJoinAndSelect('location.profiles', 'profiles')
      .leftJoinAndSelect('location.service', 'service')
      .leftJoinAndSelect('profiles.position', 'position')
      .leftJoinAndSelect('position.department', 'department')
      .leftJoin('profiles.employees', 'employees')
      .where('location.id = :locationId', { locationId })
      .getOne();
    if (location == undefined) throw Error('No location');
    location.profiles?.forEach((location) => {
      location.minWage = location.minWage ? location.minWage / 100 : undefined;
      location.maxWage = location.maxWage ? location.maxWage / 100 : undefined;
      location.price = location.price ? location.price / 100 : undefined;
      location.employees?.forEach((employee) => {
        employee.baseWage = employee.baseWage
          ? employee.baseWage / 100
          : undefined;
      });
    });
    this.id = location.id;
    this.name = location.name;
    this.service = location.service;
    this.status = location.status;
    this.serviceId = location.serviceId;
    this.service = location.service;
    this.addressId = location.addressId;
    this.address = location.address;
    this.profiles = location.profiles;
    return this.formatLocation();
  }

  public async getAllLocations() {
    const locations = await getRepository(Location)
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.address', 'address')
      .leftJoinAndSelect('location.profiles', 'profiles')
      .leftJoinAndSelect('profiles.employees', 'employees')
      .getMany();
    return this.formatLocations(locations);
  }

  public formatLocations(locations: Location[]) {
    const res: Array<ImultipleLocations> = [];
    locations.forEach((location) => {
      const formatted: ImultipleLocations = {
        id: location.id!,
        name: location.name!,
        owner: location.service ? 'Servicio externo' : 'Seguridad HCS',
        address: {
          municipality: location.address!.municipality,
          state: location.address!.state
        },
        hr: {
          total: location.profiles!.reduce((prev, curr) => {
            if (curr.total === undefined) return prev;
            return prev + curr.total;
          }, 0),
          hired: location.profiles!.reduce((prev, curr) => {
            if (curr.employees === undefined) return prev;
            return prev + curr.employees?.length;
          }, 0)
        }
      };
      res.push(formatted);
    });
    return res;
  }

  public formatLocation() {
    return {
      id: this.id,
      name: this.name,
      service: this.serviceId,
      status: this.status,
      address: {
        street: this.address?.street,
        intNumber: this.address?.intNumber,
        outNumber: this.address?.outNumber,
        neighborhood: this.address?.neighborhood,
        municipality: this.address?.municipality,
        state: this.address?.state,
        zip: this.address?.state
      },
      profiles: this.profiles
    };
  }

  @BeforeInsert()
  async validateModel(): Promise<void> {
    this.id = uuidv4();
    await validateOrReject(this, {
      validationError: { value: true, target: false }
    });
  }
}
