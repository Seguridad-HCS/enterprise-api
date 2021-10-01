import {
	Entity,
	Column,
	BeforeInsert,
	PrimaryColumn,
	OneToMany,
    BaseEntity,
    getRepository,
} from 'typeorm';
import { 
    IsOptional,
    IsUUID, 
	Length, 
	validateOrReject 
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import bcrypt from 'bcrypt';

import PartnerContact from 'models/PartnerContact.model';

interface InewPartner {
	name: string;
	legalName: string;
    rfc: string;
    representative: string;
    phoneNumber: string;
    email: string;
}

@Entity({ name: 'partner' })
export default class Partner extends BaseEntity {
	@PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
    @IsUUID()
    id?: string;

	@Column({ type: 'varchar', length: 50, nullable: false, unique: true })
	@Length(3, 50)
	name?: string;

    @Column({ type: 'varchar', length: 80, nullable: false, unique: true })
	@Length(3, 80)
	legalName?: string;

    @Column({ type: 'varchar', length: 30, nullable: false, unique: false })
	@Length(3, 30)
	rfc?: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: false })
	@Length(3, 50)
	representative?: string;

    @Column({ type: 'varchar', length: 30, nullable: true, unique: false })
	@Length(3, 30)
	phoneNumber?: string;

    @Column({ type: 'varchar', length: 30, nullable: true, unique: false })
	@Length(3, 30)
	email?: string;

    @Column({ type: 'varchar', length: 30, nullable: true, unique: false })
    @Length(3, 30)
	@IsOptional()
	password?: string;

    @OneToMany(() => PartnerContact, (contact) => contact.partner)
	contacts?: PartnerContact[];

	public constructor(params?: InewPartner) {
        super();
		if (params) {
			this.name = params.name;
			this.legalName = params.legalName;
            this.rfc = params.rfc;
            this.representative = params.representative;
            this.phoneNumber = params.phoneNumber;
            this.email = params.email;
		}
	}

    // TODO agregar validacion de no service (regla de negocio)
    public async getPartner(partnerId:string) {
        if(!(uuidValidate(partnerId) && uuidVersion(partnerId) === 4)) throw Error('No partner')
        const query = await getRepository(Partner)
            .createQueryBuilder('partner')
            .leftJoinAndSelect('partner.contacts', 'contacts')
            .where('partner.id = :partnerId', { partnerId })
            .getOne();
        if(query == undefined) throw Error('No partner');
        this.id = query.id;
        this.name = query.name;
        this.legalName = query.legalName;
        this.rfc = query.rfc;
        this.representative = query.representative;
        this.phoneNumber = query.phoneNumber;
        this.email = query.email;
        this.contacts = query.contacts
        return this.formatPartner();
    }

    public formatPartner() {
        return {
            id: this.id,
            name: this.name,
            legalName: this.legalName,
            rfc: this.rfc,
            representative: this.representative,
            phoneNumber: this.phoneNumber,
            email: this.email,
            contacts: this.contacts
        };
    }

    public async getAllPartners() {
		const partners = await getRepository(Partner)
			.createQueryBuilder('partner')
			.getMany();
		return partners;
	}

    public setPassword(password:string) {
		const salt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(this.password!, salt);
	}

	@BeforeInsert()
	async validateModel() {
		this.id = uuidv4();
		await validateOrReject(this, { validationError: { value: true, target: false } });
	}
}
