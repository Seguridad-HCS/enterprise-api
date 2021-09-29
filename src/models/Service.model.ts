import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    BeforeInsert, 
    OneToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { 
    IsOptional, 
    IsString, 
    Length, 
    validateOrReject 
} from 'class-validator';

import ServiceFile from 'models/ServiceFile.model';
import Location from 'models/Location.model';

interface IserviceData {
}

@Entity({ name: 'Service' })
export default class Service {
	@PrimaryGeneratedColumn('increment')
	id?: number

	@Column({ type: 'varchar', length: 30, nullable: false })
	@IsString()
	@Length(5, 30)
	status?: string

	@Column({ type: 'date', nullable: true })
	startDate?: Date

	@Column({ type: 'date', nullable: true })
	endDate?: Date

    @Column({ nullable: true })
	pdfConstitutiveActId?: number
	@OneToOne(() => ServiceFile, { cascade: true, nullable: true })
	@JoinColumn({ name: 'pdfConstitutiveActId' })
	pdfConstitutiveAct?: ServiceFile;

    @Column({ nullable: true })
	pdfPowerOfAttorneyId?: number
	@OneToOne(() => ServiceFile, { cascade: true, nullable: true })
	@JoinColumn({ name: 'pdfPowerOfAttorneyId' })
	pdfPowerOfAttorney?: ServiceFile;

    @Column({ nullable: true })
	pdfAddressProofId?: number
	@OneToOne(() => ServiceFile, { cascade: true, nullable: true })
	@JoinColumn({ name: 'pdfAddressProofId' })
	pdfAddressProof?: ServiceFile;

    @Column({ nullable: true })
	pdfIneId?: number
	@OneToOne(() => ServiceFile, { cascade: true, nullable: true })
	@JoinColumn({ name: 'pdfIne' })
	pdfIne?: ServiceFile;

    @OneToMany(() => Location, (location) => location.service)
	locations: Location[] | undefined;

	public constructor(params?: IserviceData) {
		if (params) {
            this.status = 'registro';
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
