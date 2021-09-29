import {
	Entity,
	Column,
	BeforeInsert,
	PrimaryGeneratedColumn,
	OneToMany,
    OneToOne,
    JoinColumn,
	getRepository,
	BaseEntity,
	ManyToOne,
} from 'typeorm';
import { 
	IsString, 
	Length, 
	validateOrReject 
} from 'class-validator';

import LocationAddress from 'models/LocationAddress.model';
import LocationProfile from 'models/LocationProfile.model';
import Service from 'models/Service.model';

interface Ilocation {
	name: string;
	address: {
        street: string
        outNumber: string
        intNumber: string
        neighborhood: string
        zip: string
        municipality: string
        state: string
    }
}

interface ImultipleLocations {
    id: number;
    name: string;
    owner: string;
    address: {
        id: number;
        municipality: string;
        state: string;
    }
    hr: {
        total: number;
        hired: number;
    }
}

@Entity({ name: 'location' })
export default class Location extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
    id?: number;

	@Column({ type: 'varchar', length: 30, nullable: false, unique: true })
	@IsString()
	@Length(3, 30)
	name?: string;

	@Column({ nullable: true })
	serviceId?: number
    @ManyToOne(() => Service, (service) => service.locations)
	@JoinColumn({ name: 'serviceId' })
	service?: Service;

	@Column({ type: 'boolean', nullable: false, default:true })
	status?: boolean;

    @Column({ nullable: true })
	addressId?: number
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

	public async getLocation(locationId:number) {
		const location = await getRepository(Location)
        	.createQueryBuilder('location')
			.select(['location', 'employees.id', 'employees.name', 'employees.surname', 'employees.secondSurname', 'employees.baseWage'])
        	.leftJoinAndSelect('location.address', 'address')
        	.leftJoinAndSelect('location.profiles', 'profiles')
			.leftJoinAndSelect('profiles.position', 'position')
			.leftJoinAndSelect('position.department', 'department')
        	.leftJoin('profiles.employees', 'employees')
        	.where('location.id = :locationId', { locationId })
        	.getOne();
		if(location == undefined) throw Error('No location');
		location.profiles?.forEach(location => {
			location.minWage = location.minWage! / 100;
			location.maxWage = location.maxWage! / 100;
			location.price = location.price! / 100;
			location.employees?.forEach(employee => {
				employee.baseWage = employee.baseWage! / 100;
			});
		});
		this.id = location.id;
		this.name = location.name;
		this.service = location.service;
		this.status = location.status;
		this.addressId = location.addressId;
		this.address = location.address;
		this.profiles = location.profiles;

		return {
			id: this.id,
			name: this.name,
			service: this.service,
			status: this.status,
			address: this.address,
			profiles: this.profiles
		}
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

	public formatLocations(locations:Location[]) {
		const res:Array<ImultipleLocations> = [];
		locations.forEach(location => {
			let formatted:ImultipleLocations = {
				id: location.id!,
				name: location.name!,
				owner: location.service ? 'Servicio externo' : 'Seguridad HCS',
				address: {
					id: location.address!.id!,
					municipality: location.address!.municipality,
					state: location.address!.state
				},
				hr: {
					total: location.profiles!.reduce((prev, curr) => {
						if(curr.total === undefined) return prev;
						return prev + curr.total;
					}, 0),
					hired: location.profiles!.reduce((prev, curr) => {
						if(curr.employees === undefined) return prev;
						return prev + curr.employees?.length;
					}, 0)
				}
			};
			res.push(formatted);
		});
		return res;
	}

	@BeforeInsert()
	async validateModel() {
		try {
			await validateOrReject(this);
		} catch(e) {
			return e;
		}
	}
}
