import {
	Entity,
	Column,
	BeforeInsert,
	PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { 
    IsString, 
    Length, 
    validateOrReject 
} from 'class-validator';

import Department from 'models/Department.model';
import LocationProfile from 'models/LocationProfile.model';

interface InewPosition {
	name: string;
	description: string;
    department: Department;
}

@Entity({ name: 'position' })
export default class Position {
	@PrimaryGeneratedColumn('increment')
    id?: number;

	@Column({ type: 'varchar', length: 30, nullable: false, unique: true })
	@IsString()
	@Length(3, 30)
	name!: string;

	@Column({ type: 'varchar', length: 150, nullable: false })
	@IsString()
	@Length(3, 150)
	description!: string;

    @Column({ nullable: true })
	departmentId?: number
    @ManyToOne(() => Department, (department) => department.positions, { cascade: true, nullable: false })
	@JoinColumn({ name: 'departmentId' })
	department!: Department;

    @OneToMany(() => LocationProfile, (profile) => profile.position)
	locationProfiles?: LocationProfile[];

	public constructor(params: InewPosition) {
		if (params) {
			this.name = params.name;
			this.description = params.description;
            this.department = params.department;
		}
	}

	@BeforeInsert()
	async validateModel() {
		await validateOrReject(this);
	}
}
