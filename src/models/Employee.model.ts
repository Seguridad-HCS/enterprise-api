import {
	Entity,
	Column,
	BeforeInsert,
	Unique,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	PrimaryColumn
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

import LocationProfile from 'models/LocationProfile.model';

interface newEmployee {
	name: string;
	surname: string;
	secondsurname: string;
	sex: boolean;
	birthDate: string;
	email: string;
	password: string;
	nss: string;
	bloodType: string;
	rfc: string;
	locationProfile: LocationProfile;
}

@Entity({ name: 'employee' })
@Unique(['name', 'surname', 'secondSurname'])
export default class Employee {
	@PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
    @IsUUID()
    id!: string;

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

	@Column({ type: 'varchar', length: 80, nullable: false })
	@Length(3, 80)
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

	@Column({ nullable: true })
	locationProfileId?: number
    @ManyToOne(() => LocationProfile, (profile) => profile.employees)
	@JoinColumn({ name: 'locationProfileId' })
	locationProfile?: LocationProfile;

	public constructor(params?: newEmployee) {
		if (params) {
			this.id = uuidv4();
			this.name = params.name;
			this.surname = params.surname;
			this.secondSurname = params.secondsurname;
			this.sex = params.sex;
			this.birthDate = new Date(params.birthDate);
			this.email = params.email;
			this.password = params.password;
			this.nss = params.nss;
			this.bloodtype = params.bloodType;
			this.rfc = params.rfc;
			this.locationProfile = params.locationProfile;
		}
	}

	@BeforeInsert()
	async validateModel() {
		await validateOrReject(this);
	}
}
