import {
	Entity,
	Column,
	BeforeInsert,
	PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import {  
    Max, 
    Min, 
	validateOrReject 
} from 'class-validator';

import Position from 'models/Position.model';
import Employee from 'models/Employee.model';

interface IlocationProfile {
	total: number;
    minAge: number;
    maxAge: number;
    price: number;
    sex?: boolean;
    position: Position;
}

@Entity({ name: 'location_profile' })
export default class LocationProfile {
	@PrimaryGeneratedColumn('increment')
    id?: number;

	@Column({ type: 'smallint', nullable: false })
    @Min(1)
	total!: number

    @Column({ type: 'smallint', nullable: false })
    @Min(18)
    minAge!: number;

    @Column({ type: 'smallint', nullable: false })
    @Max(70)
    maxAge!: number;

    @Column({ type: 'integer', nullable: false })
    price!: number;

    @Column({ type: 'boolean' })
    sex?: boolean;

    @Column({ nullable: true })
	positionId?: number
    @ManyToOne(() => Position, (position) => position.locationProfiles)
	@JoinColumn({ name: 'positionId' })
	position?: Position;

    @OneToMany(() => Employee, (employee) => employee.locationProfile)
	employees?: Employee[];

	public constructor(params: IlocationProfile) {
		if (params) {
			this.total = params.total;
            this.minAge = params.minAge;
            this.maxAge = params.maxAge;
            this.price = params.price;
            this.sex = params.sex;
            this.position = params.position;
		}
	}

	@BeforeInsert()
	async validateModel() {
		await validateOrReject(this);
	}
}