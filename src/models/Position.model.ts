import {
	Entity,
	Column,
	BeforeInsert,
    ManyToOne,
    JoinColumn,
    OneToMany,
	PrimaryColumn,
	getRepository,
} from 'typeorm';
import { 
    IsString, 
	IsUUID, 
    Length, 
    validateOrReject 
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import Department from 'models/Department.model';
import LocationProfile from 'models/LocationProfile.model';

interface InewPosition {
	name: string;
	description: string;
    department: Department;
}

@Entity({ name: 'position' })
export default class Position {
	@PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
    @IsUUID()
    id?: string;

	@Column({ type: 'varchar', length: 30, nullable: false, unique: true })
	@IsString()
	@Length(3, 30)
	name!: string;

	@Column({ type: 'varchar', length: 150, nullable: false })
	@IsString()
	@Length(3, 150)
	description!: string;

    @Column({ nullable: true })
	departmentId?: string
    @ManyToOne(() => Department, (department) => department.positions, { cascade: true, nullable: false })
	@JoinColumn({ name: 'departmentId' })
	department!: Department;

    @OneToMany(() => LocationProfile, (profile) => profile.position)
	locationProfiles?: LocationProfile[];

	public constructor(params?: InewPosition) {
		if (params) {
			this.name = params.name;
			this.description = params.description;
            this.department = params.department;
		}
	}

	public async getAllPositions() {
		const positions = await getRepository(Position)
			.createQueryBuilder('position')
			.leftJoinAndSelect('position.department', 'department')
			.getMany();
		return this.formatPositions(positions);
	}

	public formatPositions(positions:Position[]) {
		let res:any[] = [];
		positions.forEach(position => {
			const formatted = {
				id: position.id,
				name: position.name,
				department: position.department.name
			}
			res.push(formatted);
		});
		return res;
	}
	
	@BeforeInsert()
	async validateModel() {
		this.id = uuidv4();
		await validateOrReject(this, { validationError: { value: true, target: false } });
	}
}
