import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    BeforeInsert 
} from 'typeorm'
import {
    validateOrReject 
} from 'class-validator'

interface IservicefileData {
	file: string;
}

@Entity({ name: 'Service' })
export default class Service {
	@PrimaryGeneratedColumn('increment')
	id?: number

	@Column({ type: 'boolean', nullable: false, default: false })
	lock?: boolean

	@Column({ type: 'varchar', nullable: false })
	file?: string

	public constructor(params?: IservicefileData) {
		if (params) {
            this.file = params.file;
		}
	}

	@BeforeInsert()
	async validateModel() {
		try {
			await validateOrReject(this)
		} catch(e) {
			return e;
		}
	}
}
