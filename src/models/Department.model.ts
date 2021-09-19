import {
	Entity,
	Column,
	BeforeInsert,
	PrimaryGeneratedColumn,
	OneToMany,
} from 'typeorm';
import { 
	IsString, 
	Length, 
	validateOrReject 
} from 'class-validator';
import Position from 'models/Position.model';

interface InewDepartment {
	name: string;
	description: string;
}

@Entity({ name: 'department' })
export default class Department {
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

	@OneToMany(() => Position, (position) => position.department)
	positions: Position[] | undefined;

	public constructor(params: InewDepartment) {
		if (params) {
			this.name = params.name;
			this.description = params.description;
		}
	}

	@BeforeInsert()
	async validateModel() {
		await validateOrReject(this);
	}
}
