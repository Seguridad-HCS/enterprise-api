import {
	Entity,
	Column,
	BeforeInsert,
	Unique,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	PrimaryColumn,
	getRepository,
	BaseEntity
} from 'typeorm';
import { 
	IsBoolean, 
	IsDate, 
	IsEmail, 
	IsOptional, 
	IsString, 
	IsUUID, 
	Length, 
	validateOrReject 
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import bcrypt from 'bcrypt';

import LocationProfile from 'models/LocationProfile.model';

interface newEmployee {
	name: string;
	surname: string;
	secondSurname: string;
	sex: boolean;
	birthDate: string;
	email: string;
	nss: string;
	bloodtype: string;
	baseWage: number;
	rfc: string;
	locationProfile: LocationProfile;
}

@Entity({ name: 'employee' })
@Unique(['name', 'surname', 'secondSurname'])
export default class Employee extends BaseEntity {
	@PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
    @IsUUID()
    id?: string;

	@Column({ type: 'varchar', length: 30, nullable: false })
	@IsString()
	@Length(3, 30)
	name?: string;

	@Column({ type: 'varchar', length: 30, nullable: false })
	@IsString()
	@Length(3, 30)
	surname?: string;

	@Column({ type: 'varchar', length: 30 })
	@IsString()
	@Length(3, 30)
	@IsOptional()
	secondSurname?: string

	@Column({ type: 'boolean', nullable: false })
	@IsBoolean()
	sex?: boolean;

	@Column({ type: 'date', nullable: false })
	@IsDate()
	birthDate?: Date;

	@CreateDateColumn({ type: 'date', nullable: false })
	createdAt?: Date;

	@Column({ type: 'varchar', length: 50, nullable: false, unique: true })
	@IsEmail()
	@Length(3, 50)
	email?: string;

	@Column({ type: 'varchar', length: 80, nullable: true })
	@IsOptional()
	password?: string;

	@Column({ type: 'varchar', length: 30, nullable: false })
	@IsString()
	@Length(3, 30)
	nss?: string;

	@Column({ type: 'varchar', length: 4, nullable: false })
	@IsString()
	@Length(1, 4)
	bloodtype?: string;

	@Column({ type: 'varchar', length: 20, nullable: false })
	@IsString()
	@Length(1, 20)
	rfc?: string;

	@Column({ type: 'integer', nullable: true })
	lastLogin?: number;

	@Column({ type: 'integer', nullable: false })
	baseWage?: number;

	@Column({ nullable: true })
	locationProfileId?: string
    @ManyToOne(() => LocationProfile, (profile) => profile.employees)
	@JoinColumn({ name: 'locationProfileId' })
	locationProfile?: LocationProfile;

	public constructor(params?: newEmployee) {
		super();
		if (params) {
			this.name = params.name;
			this.surname = params.surname;
			this.secondSurname = params.secondSurname;
			this.sex = params.sex;
			this.birthDate = new Date(params.birthDate);
			this.email = params.email;
			this.nss = params.nss;
			this.bloodtype = params.bloodtype;
			this.rfc = params.rfc;
			this.baseWage = params.baseWage;
			this.locationProfile = params.locationProfile;
		}
	}

	public async getEmployee(employeeId:string) {
		if(!(uuidValidate(employeeId) && uuidVersion(employeeId) === 4)) throw Error('No employee');
		const employee = await getRepository(Employee)
        	.createQueryBuilder('employee')
        	.leftJoinAndSelect('employee.locationProfile', 'profile')
			.leftJoinAndSelect('profile.location', 'location')
			.leftJoinAndSelect('location.address', 'address')
        	.leftJoinAndSelect('profile.position', 'position')
			.leftJoinAndSelect('position.department', 'department')
        	.where('employee.id = :employeeId', { employeeId })
        	.getOne();
		if(employee == undefined) throw Error('No employee');
		this.id = employee.id;
		this.name = employee.name;
		this.surname = employee.surname;
		this.secondSurname = employee.secondSurname;
		this.sex = employee.sex;
		this.birthDate = employee.birthDate;
		this.createdAt = employee.createdAt;
		this.email = employee.email;
		this.nss = employee.nss;
		this.bloodtype = employee.bloodtype;
		this.rfc = employee.rfc;
		this.baseWage = employee.baseWage;
		this.locationProfile = employee.locationProfile;

		return this.formatEmployee();
	}

	public formatEmployee() {
		return {
			id: this.id,
			name: this.name,
			surname: this.surname,
			secondSurname: this.secondSurname,
			sex: this.sex,
			birthDate: this.birthDate,
			createdAt: this.createdAt,
			email: this.email,
			nss: this.nss,
			bloodtype: this.bloodtype,
			rfc: this.rfc,
			baseWage: this.baseWage,
			profile: {
				id: this.locationProfile?.id,
				total: this.locationProfile?.total,
				minAge: this.locationProfile?.minAge,
				maxAge: this.locationProfile?.maxAge,
				sex: this.locationProfile?.sex,
				minWage: this.locationProfile?.minWage,
				maxWage: this.locationProfile?.maxWage,
				price: this.locationProfile?.price
			},
			position: {
				name: this.locationProfile?.position?.name,
				description: this.locationProfile?.position?.description,
				department: this.locationProfile?.position?.department?.name
			},
			location: {
				id: this.locationProfile?.location?.id,
				name: this.locationProfile?.location?.name,
				service: this.locationProfile?.location?.service,
				address: {
					street: this.locationProfile?.location?.address?.street,
					outNumber: this.locationProfile?.location?.address?.outNumber,
					intNumber: this.locationProfile?.location?.address?.intNumber,
					zip: this.locationProfile?.location?.address?.zip,
					municipality: this.locationProfile?.location?.address?.municipality,
					state: this.locationProfile?.location?.address?.state,
					neighborhood: this.locationProfile?.location?.address?.neighborhood
				}
			}
		}
	} 

	public setPassword(password:string) {
		const salt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(password, salt);
	}

	@BeforeInsert()
	async validateModel() {
		this.id = uuidv4();
		await validateOrReject(this, { validationError: { value: true, target: true } });
	}
}
