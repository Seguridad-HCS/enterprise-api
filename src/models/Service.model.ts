import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
  BaseEntity,
  getRepository
} from 'typeorm';
import { IsString, IsUUID, Length, validateOrReject } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

import ServiceFile from 'models/ServiceFile.model';
import Location from 'models/Location.model';
import Partner from 'models/Partner.model';

interface IserviceData {
  partner: Partner;
}

@Entity({ name: 'service' })
export default class Service extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
  @IsUUID()
  id?: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsString()
  @Length(5, 30)
  status?: string;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  constitutiveActId?: number;
  @OneToOne(() => ServiceFile, { cascade: true, nullable: true })
  @JoinColumn({ name: 'constitutiveActId' })
  constitutiveAct?: ServiceFile;

  @Column({ nullable: true })
  powerOfAttorneyId?: number;
  @OneToOne(() => ServiceFile, { cascade: true, nullable: true })
  @JoinColumn({ name: 'powerOfAttorneyId' })
  powerOfAttorney?: ServiceFile;

  @Column({ nullable: true })
  addressProofId?: number;
  @OneToOne(() => ServiceFile, { cascade: true, nullable: true })
  @JoinColumn({ name: 'addressProofId' })
  addressProof?: ServiceFile;

  @Column({ nullable: true })
  ineId?: string;
  @OneToOne(() => ServiceFile, { cascade: true, nullable: true })
  @JoinColumn({ name: 'ineId' })
  ine?: ServiceFile;

  @OneToMany(() => Location, (location) => location.service)
  locations: Location[] | undefined;

  @Column({ nullable: false })
  partnerId?: string;
  @ManyToOne(() => Partner, (partner) => partner.services)
  @JoinColumn({ name: 'partnerId' })
  partner?: Partner;

  public constructor(params?: IserviceData) {
    super();
    if (params) {
      this.status = 'registro';
      typeof params.partner === 'string'
        ? (this.partnerId = params.partner)
        : (this.partner = params.partner);
    }
  }

  public async getService(serviceId: string) {
    if (!(uuidValidate(serviceId) && uuidVersion(serviceId) === 4))
      throw Error('No service');
    const query = await getRepository(Service)
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.constitutiveAct', 'constitutiveAct')
      .leftJoinAndSelect('service.powerOfAttorney', 'powerOfAttorney')
      .leftJoinAndSelect('service.addressProof', 'addressProof')
      .leftJoinAndSelect('service.ine', 'Ine')
      .leftJoinAndSelect('service.locations', 'locations')
      .where('service.id = :serviceId', { serviceId })
      .getOne();
    if (query == undefined) throw Error('No service');
    this.id = query.id;
    this.status = query.status;
    this.startDate = query.startDate;
    this.endDate = query.endDate;
    this.constitutiveAct = query.constitutiveAct;
    this.powerOfAttorney = query.powerOfAttorney;
    this.addressProof = query.addressProof;
    this.ine = query.ine;
    this.locations = query.locations;
    return this.formatService();
  }

  public formatService() {
    return {
      id: this.id,
      status: this.status,
      startDate: this.startDate,
      endDate: this.endDate,
      constitutiveAct: this.constitutiveAct ? this.constitutiveAct.lock : null,
      powerOfAttorney: this.powerOfAttorney ? this.powerOfAttorney.lock : null,
      addressProof: this.addressProof ? this.addressProof.lock : null,
      ine: this.ine ? this.ine.lock : null
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
