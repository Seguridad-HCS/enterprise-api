import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  OneToMany,
  BaseEntity,
  getRepository,
  OneToOne,
  JoinColumn,
  BeforeUpdate
} from 'typeorm';
import { IsOptional, IsUUID, Length, validateOrReject } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import bcrypt from 'bcrypt';

import PartnerContact from 'models/PartnerContact.model';
import Service from 'models/Service.model';
import Billing from 'models/Billing.model';

interface InewPartner {
  name: string;
  legalName: string;
  rfc: string;
  representative: string;
  phoneNumber: string;
  email: string;
}

interface IuserContacts {
  id?: string;
  name?: string;
  role?: string;
  phoneNumber?: string;
  email?: string;
}
interface IuserServices {
  id?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

interface ImultiplePartners {
  id?: string;
  name?: string;
  representative?: string;
  services: Array<IserviceInfo>;
}

interface IserviceInfo {
  id?: string;
  status?: string;
}

interface IaddressData {
  street?: string | null;
  outNumber?: string | null;
  intNumber?: string | null;
  neighborhood?: string | null;
  zip?: string | null;
  municipality?: string | null;
  state?: string | null;
}

interface IbillingData {
  method?: string | null;
  chequeno?: string | null;
  account?: string | null;
  address?: IaddressData | null;
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

  @OneToMany(() => Service, (service) => service.partner)
  services?: Service[];

  @OneToMany(() => PartnerContact, (contact) => contact.partner)
  contacts?: PartnerContact[];

  @Column({ nullable: true })
  billingId?: string;
  @OneToOne(() => Billing, { cascade: true, nullable: true })
  @JoinColumn({ name: 'billingId' })
  billing?: Billing;

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

  public async canCreateService(): Promise<boolean> {
    let flag = true;
    const services = await this.getServices();
    services.forEach((service: Service) => {
      if (
        service.status == undefined ||
        ['registro', 'negociacion'].includes(service.status)
      ) {
        flag = false;
        return;
      }
    });
    return flag;
  }

  public async canDeleteLastContact(): Promise<boolean> {
    let flag = true;
    const services = await this.getServices();
    services.forEach((service) => {
      if (
        service.status == undefined ||
        ['negociacion', 'preactivo', 'activo'].includes(service.status)
      ) {
        flag = false;
        return;
      }
    });
    return flag;
  }

  // TODO agregar validacion de no service (regla de negocio)
  public async getPartner(partnerId: string): Promise<void> {
    if (!(uuidValidate(partnerId) && uuidVersion(partnerId) === 4))
      throw Error('No partner');
    const query = await getRepository(Partner)
      .createQueryBuilder('partner')
      .leftJoinAndSelect('partner.billing', 'billing')
      .where('partner.id = :partnerId', { partnerId })
      .getOne();
    if (query == undefined) throw Error('No partner');
    this.id = query.id;
    this.name = query.name;
    this.legalName = query.legalName;
    this.rfc = query.rfc;
    this.representative = query.representative;
    this.phoneNumber = query.phoneNumber;
    this.email = query.email;
    this.billing = query.billing;
  }

  public async getContacts(): Promise<PartnerContact[]> {
    if (this.id === undefined) throw Error('No partner');
    const contacts = await getRepository(PartnerContact)
      .createQueryBuilder('contact')
      .where('contact.partner = :partnerId', { partnerId: this.id })
      .getMany();
    return contacts;
  }

  public async getServices(): Promise<Service[]> {
    if (this.id === undefined) throw Error('No partner');
    const services = await getRepository(Service)
      .createQueryBuilder('service')
      .where('service.partner = :partnerId', { partnerId: this.id })
      .getMany();
    return services;
  }

  public async getFullRegister() {
    const contacts = await this.getContacts();
    const services = await this.getServices();
    const userContacts: IuserContacts[] = [];
    const userServices: IuserServices[] = [];
    let billing: IbillingData | null = null;
    if (this.billing !== null) {
      let address: IaddressData | null = null;
      await this.billing?.getAddress();
      if (this.billing?.address !== null) {
        address = {
          street: this.billing?.address?.street,
          intNumber: this.billing?.address?.intNumber,
          outNumber: this.billing?.address?.outNumber,
          neighborhood: this.billing?.address?.neighborhood,
          municipality: this.billing?.address?.municipality,
          state: this.billing?.address?.state,
          zip: this.billing?.address?.zip
        };
      }
      billing = {
        method: this.billing?.method,
        chequeno: this.billing?.account,
        account: this.billing?.account,
        address
      };
    }
    contacts.forEach((contact: PartnerContact) => {
      const formatted = {
        id: contact.id,
        name: contact.name,
        role: contact.role,
        phoneNumber: contact.phoneNumber,
        email: contact.email
      };
      userContacts.push(formatted);
    });
    services.forEach((service: Service) => {
      const formatted = {
        id: service.id,
        status: service.status,
        startDate: service.startDate,
        endDate: service.endDate
      };
      userServices.push(formatted);
    });
    const response = {
      id: this.id,
      name: this.name,
      legalName: this.legalName,
      rfc: this.rfc,
      representative: this.representative,
      phoneNumber: this.phoneNumber,
      email: this.email,
      billing,
      contacts: userContacts,
      services: userServices
    };
    return response;
  }

  public async getAllPartners(): Promise<ImultiplePartners[]> {
    const partners = await getRepository(Partner)
      .createQueryBuilder('partner')
      .leftJoinAndSelect('partner.services', 'services')
      .getMany();
    const res: ImultiplePartners[] = [];
    partners.forEach((partner) => {
      const formatted: ImultiplePartners = {
        id: partner.id,
        name: partner.name,
        representative: partner.representative,
        services: []
      };
      partner.services?.forEach((service) => {
        if (service.status === 'finalizado') return;
        else {
          formatted.services.push({
            id: service.id,
            status: service.status
          });
        }
      });
      res.push(formatted);
    });
    return res;
  }
  public setPassword(password: string): void {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(password, salt);
  }
  public async validateInstance(): Promise<void> {
    await validateOrReject(this, {
      validationError: { value: true, target: false }
    });
  }

  @BeforeInsert()
  async insertDb(): Promise<void> {
    this.id = uuidv4();
    await this.validateInstance();
  }
  @BeforeUpdate()
  async updateDb(): Promise<void> {
    await this.validateInstance();
  }
}
