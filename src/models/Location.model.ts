import {
	Entity,
	Column,
	BeforeInsert,
	PrimaryGeneratedColumn,
	OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { 
	IsString, 
	Length, 
	validateOrReject 
} from 'class-validator';

import Position from 'models/Position.model';
import LocationAddress from 'models/LocationAddress.model';

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

@Entity({ name: 'location' })
export default class Location {
	@PrimaryGeneratedColumn('increment')
    id?: number;

	@Column({ type: 'varchar', length: 30, nullable: false, unique: true })
	@IsString()
	@Length(3, 30)
	name!: string;

    @Column({ nullable: true })
	addressId?: number
	@OneToOne(() => LocationAddress, { cascade: true, nullable: false })
	@JoinColumn({ name: 'addressId' })
	address!: LocationAddress;

	@OneToMany(() => Position, (position) => position.department)
	positions?: Position[];

	public constructor(params: Ilocation) {
		if (params) {
			this.name = params.name;
			this.address = new LocationAddress(params.address);
		}
	}

	@BeforeInsert()
	async validateModel() {
		await validateOrReject(this);
	}
}
