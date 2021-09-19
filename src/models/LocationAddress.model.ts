import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    BeforeInsert 
} from 'typeorm'
import { 
    IsOptional, 
    IsString, 
    Length, 
    validateOrReject 
} from 'class-validator'

interface IaddressData {
	street: string
	outNumber: string
	intNumber: string
	neighborhood: string
	zip: string
	municipality: string
	state: string
}

@Entity({ name: 'location_address' })
export default class LocationAddress {
	@PrimaryGeneratedColumn('increment')
	id?: number

	@Column({ type: 'varchar', length: 30, nullable: false })
	@IsString()
	@Length(5, 30)
	street!: string

	@Column({ type: 'varchar', length: 12, nullable: false })
	@IsString()
	@Length(1, 12)
	intNumber!: string

	@Column({ type: 'varchar', length: 12 })
	@IsString()
	@Length(1, 12)
	@IsOptional()
	outNumber!: string

	@Column({ type: 'varchar', length: 30, nullable: false })
	@IsString()
	@Length(5, 30)
	neighborhood!: string

	@Column({ type: 'varchar', length: 30, nullable: false })
	@IsString()
	@Length(5, 30)
	municipality!: string

	@Column({ type: 'varchar', length: 30, nullable: false })
	@IsString()
	@Length(4, 30)
	state!: string

	@Column({ type: 'varchar', length: 10, nullable: false })
	@IsString()
	@Length(1, 10)
	zip!: string

	public constructor(params?: IaddressData) {
		if (params) {
			this.street = params.street
			this.intNumber = params.intNumber
			this.outNumber = params.outNumber
			this.neighborhood = params.neighborhood
			this.municipality = params.municipality
			this.state = params.state
			this.zip = params.zip
		}
	}

	@BeforeInsert()
	async validateModel() {
		await validateOrReject(this)
	}
}
