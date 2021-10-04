import {
	Entity,
	Column,
	BeforeInsert,
    JoinColumn,
    ManyToOne,
    OneToMany,
    Check,
    BaseEntity,
    getRepository,
    PrimaryColumn,
} from 'typeorm';
import {  
    IsBoolean,
    IsOptional,
    IsUUID,
    Max, 
    Min, 
	validateOrReject 
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

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
    location: Location | string;
    position: Position | string;
}

@Entity({ name: 'location_profile' })
@Check('"minAge" < "maxAge"')
@Check('"minWage" < "maxWage"')
export default class LocationProfile extends BaseEntity {
	@PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
    @IsUUID()
    id?: string;

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

    @Column({ type: 'integer', nullable: false })
    @Min(0)
    minWage?: number;

    @Column({ type: 'integer', nullable: false })
    maxWage?: number;

    @Column({ type: 'boolean', nullable: true })
    @IsBoolean()
    @IsOptional()
    sex?: boolean;

    @Column({ nullable: false })
	locationId?: string
    @ManyToOne(() => Location, (location) => location.profiles, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'locationId' })
	location?: Location;

    @Column({ nullable: false })
	positionId?: string
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
            this.minWage = Math.round(params.minWage * 100);
            this.maxWage = Math.round(params.maxWage * 100);
            typeof(params.position) === 'string' ? this.positionId = params.position : this.position = params.position;
            typeof(params.location) === 'string' ? this.locationId = params.location : this.location = params.location;
		}
	}

    public async getLocationProfile(profileId:string) {
        if(!(uuidValidate(profileId) && uuidVersion(profileId) === 4)) throw Error('No location profile');
		const profile = await getRepository(LocationProfile)
        	.createQueryBuilder('profile')
            .leftJoinAndSelect('profile.position', 'position')
            .leftJoinAndSelect('position.department', 'department')
            .leftJoinAndSelect('profile.location', 'location')
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
        this.position = profile.position;
        return {
            id: this.id,
            minWage: this.minWage! / 100,
            maxWage: this.maxWage! / 100,
            price: this.price,
            sex: this.sex,
            minAge: this.minAge,
            maxAge: this.maxAge,
            employees: this.employees,
            location: this.location,
            position: {
                name: this.position?.name,
                description: this.position?.description,
                department: this.position?.department.name
            }
        }
	}

	@BeforeInsert()
	async validateModel() {
        this.id = uuidv4();
		await validateOrReject(this, { validationError: { value: true, target: false } });
	}
}