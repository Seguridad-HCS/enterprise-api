import {
  Entity,
  Column,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  BaseEntity,
  PrimaryColumn,
  getRepository,
  BeforeUpdate,
  OneToMany
} from 'typeorm';
import { IsString, IsUUID, Length, validateOrReject } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

import BillingAddress from 'models/BillingAddress.model';
import BillingProcess from 'models/BillingProcess.model';

interface Ibilling {
  method: string;
  chequeno: string;
  account: string;
}
interface IbillingAddress {
  id?: string;
  address?: {
    id: string;
    street: string;
    outNumber: string;
    intNumber: string;
    neighborhood: string;
    zip: string;
    municipality: string;
    state: string;
  };
}

@Entity({ name: 'billing' })
export default class Billing extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
  @IsUUID()
  id?: string;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: false })
  @IsString()
  @Length(3, 30)
  method?: string | null;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: false })
  @IsString()
  @Length(3, 30)
  chequeno?: string | null;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: false })
  @IsString()
  @Length(3, 30)
  account?: string | null;

  @Column({ nullable: true })
  addressId?: string;
  @OneToOne(() => BillingAddress, { cascade: true, nullable: false })
  @JoinColumn({ name: 'addressId' })
  address?: BillingAddress;

  @OneToMany(() => BillingProcess, (process) => process.billing, {
    cascade: true
  })
  processes?: BillingProcess[];

  public constructor(params?: Ibilling) {
    super();
    if (params) {
      this.method = params.method;
      this.chequeno = params.chequeno;
      this.account = params.account;
    }
  }
  public update(params: Ibilling): void {
    this.method = params.method ? params.method : null;
    this.chequeno = params.chequeno ? params.method : null;
    this.account = params.account ? params.method : null;
  }
  public async getAddress(): Promise<IbillingAddress> {
    if (this.id === undefined) throw Error('No billing');
    const billing = await getRepository(Billing)
      .createQueryBuilder('billing')
      .select('billing.id')
      .leftJoinAndSelect('billing.address', 'address')
      .where('billing.id = :billingId', { billingId: this.id })
      .getOne();
    if (billing === undefined) throw Error('No billing');
    this.address = billing.address;
    return billing as IbillingAddress;
  }
  public async getProcesses(): Promise<BillingProcess[]> {
    if (this.id === undefined) throw Error('No billing');
    const processes = await getRepository(BillingProcess)
      .createQueryBuilder('process')
      .where('process.billing = :billingId', { billingId: this.id })
      .getMany();
    processes.forEach((process: BillingProcess) => delete process.billingId);
    this.processes = processes;
    return this.processes;
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
