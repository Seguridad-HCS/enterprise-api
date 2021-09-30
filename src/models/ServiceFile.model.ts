import { 
    Entity, 
    Column, 
    BeforeInsert, 
	PrimaryColumn
} from 'typeorm';
import {
	IsUUID,
    validateOrReject 
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

interface IservicefileData {
	file: string;
}

@Entity({ name: 'Service' })
export default class Service {
	@PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
    @IsUUID()
    id?: string;

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
		this.id = uuidv4();
		await validateOrReject(this, { validationError: { value: true, target: false } });
	}
}
