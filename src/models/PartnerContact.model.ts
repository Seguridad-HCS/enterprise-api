import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  PrimaryColumn,
  getRepository
} from 'typeorm';
import { IsString, IsUUID, Length, validateOrReject } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

import Partner from 'models/Partner.model';

interface InewPartner {
  name: string;
  role: string;
  phoneNumber: string;
  email: string;
  partner: Partner;
}

@Entity({ name: 'partner_contact' })
export default class PartnerContact extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
  @IsUUID()
  id?: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: false })
  @IsString()
  @Length(3, 30)
  name?: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: false })
  @IsString()
  @Length(3, 30)
  role?: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: false })
  @IsString()
  @Length(3, 30)
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: false })
  @IsString()
  @Length(3, 30)
  email?: string;

  @Column({ type: 'varchar', nullable: false })
  partnerId?: string;
  @ManyToOne(() => Partner, (partner) => partner.contacts, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'partnerId' })
  partner?: Partner;

  public constructor(params?: InewPartner) {
    super();
    if (params) {
      this.name = params.name;
      this.role = params.role;
      this.phoneNumber = params.phoneNumber;
      this.email = params.email;
      typeof params.partner === 'string'
        ? (this.partnerId = params.partner)
        : (this.partner = params.partner);
    }
  }

  public async getContact(contactId: string) {
    if (!(uuidValidate(contactId) && uuidVersion(contactId) === 4))
      throw Error('No contact');
    const query = await getRepository(PartnerContact)
      .createQueryBuilder('contact')
      .where('contact.id = :contactId', { contactId })
      .getOne();
    if (query == undefined) throw Error('No contact');
    this.id = query.id;
    this.name = query.name;
    this.role = query.role;
    this.phoneNumber = query.phoneNumber;
    this.email = query.email;
    this.partnerId = query.partnerId;
    return this.formatContact();
  }

  public formatContact() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      phoneNumber: this.phoneNumber,
      email: this.email,
      partnerId: this.partnerId
    };
  }

  @BeforeInsert()
  async validate() {
    this.id = uuidv4();
    await validateOrReject(this, {
      validationError: { value: true, target: false }
    });
  }
}
