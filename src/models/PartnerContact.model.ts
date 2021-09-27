import {
	Entity,
	Column,
	BeforeInsert,
	PrimaryGeneratedColumn,
	OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import {
	Length, 
	validateOrReject 
} from 'class-validator';
import Partner from 'models/Partner.model';

interface InewPartner {
	name: string;
    role: string;
    phoneNumber: string;
    email: string;
	partner: Partner | number;
}

@Entity({ name: 'partner_contact' })
export default class PartnerContact {
	@PrimaryGeneratedColumn('increment')
    id?: number;

	@Column({ type: 'varchar', length: 50, nullable: false, unique: true })
	@Length(3, 30)
	name?: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
	@Length(3, 30)
	role?: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
	@Length(3, 30)
	phoneNumber?: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
	@Length(3, 30)
	email?: string;

    @Column({ nullable: true })
	partnerId?: number
    @ManyToOne(() => Partner, (partner) => partner.contacts, { nullable: false })
	@JoinColumn({ name: 'partnerId' })
	partner?: Partner;

	public constructor(params: InewPartner) {
		if (params) {
			this.name = params.name;
			this.role = params.role;
            this.phoneNumber = params.phoneNumber;
            this.email = params.email;
			typeof(params.partner) === 'number' ? this.partnerId = params.partner : this.partner = params.partner;
		}
	}

	@BeforeInsert()
	async validateModel() {
		try {
			await validateOrReject(this);
		} catch(e) {
			return e;
		}
	}
}
