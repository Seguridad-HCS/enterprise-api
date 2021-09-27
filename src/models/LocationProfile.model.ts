import {
	Entity,
	Column,
	BeforeInsert,
	PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
    Check,
    BaseEntity,
    getRepository,
} from 'typeorm';
import {  
    Max, 
    Min, 
	validateOrReject 
} from 'class-validator';

import Position from 'models/Position.model';
import Employee from 'models/Employee.model';
import Location from 'models/Location.model';

interface IlocationProfile {
	total: number;
    minAge: number;
    maxAge: number;
    price: number | undefined;
    minWage: number;
    maxWage: number;
    sex: boolean | undefined;
    location: Location;
    position: Position | number;
}

@Entity({ name: 'location_profile' })
@Check('"minAge" < "maxAge"')
@Check('"minWage" < "maxWage"')
export default class LocationProfile extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
    id?: number;

	@Column({ type: 'smallint', nullable: false })
    @Min(1)
	total?: number

    @Column({ type: 'smallint', nullable: false })
    @Min(18)
    minAge?: number;

    @Column({ type: 'smallint', nullable: false })
    @Max(70)
    maxAge?: number;

    @Column({ type: 'integer', nullable: true })
    price?: number;

    @Column({ type: 'integer', nullable: true })
    @Min(0)
    minWage?: number;

    @Column({ type: 'integer', nullable: true })
    maxWage?: number;

    @Column({ type: 'boolean' })
    sex?: boolean;

    @Column({ nullable: true })
	locationId?: number
    @ManyToOne(() => Location, (location) => location.profiles, { nullable: false })
	@JoinColumn({ name: 'locationId' })
	location?: Location;

    @Column({ nullable: true })
	positionId?: number
    @ManyToOne(() => Position, (position) => position.locationProfiles)
	@JoinColumn({ name: 'positionId' })
	position?: Position;

    @OneToMany(() => Employee, (employee) => employee.locationProfile)
	employees?: Employee[];

	public constructor(params?: IlocationProfile) {
        super();
		if (params) {
			this.total = params.total;
            this.minAge = params.minAge;
            this.maxAge = params.maxAge;
            this.price = params.price;
            this.sex = params.sex;
            this.minWage = params.minWage;
            this.maxWage = params.maxWage;
            typeof(params.position) === 'number' ? this.positionId = params.position : this.position = params.position;
            typeof(params.location) === 'number' ? this.locationId = params.location : this.location = params.location;
		}
	}

    public async getLocationProfile(profileId:number) {
		const profile = await getRepository(LocationProfile)
        	.createQueryBuilder('profile')
        	.leftJoinAndSelect('profile.employees', 'employees')
        	.where('profile.id = :profileId', { profileId })
        	.getOne();
		if(profile == undefined) throw Error('No location profile');
        this.id = profile.id;
        this.minWage = profile.minWage;
        this.maxWage = profile.maxWage;
        this.price = profile.price;
        this.sex = profile.sex;
        this.minAge = profile.minAge;
        this.maxAge = profile.maxAge;
        this.positionId = profile.positionId;
        this.locationId = profile.locationId;
        this.employees = profile.employees;
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