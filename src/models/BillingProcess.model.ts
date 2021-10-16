import {
  Entity,
  Column,
  BeforeInsert,
  JoinColumn,
  BaseEntity,
  PrimaryColumn,
  BeforeUpdate,
  ManyToOne
} from 'typeorm';
import { IsString, IsUUID, Length, validateOrReject } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

import Billing from 'models/Billing.model';

interface Iprocess {
  name: string;
  description: string;
  billing: string;
}

@Entity({ name: 'billing_process' })
export default class BillingProcess extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
  @IsUUID()
  id?: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: false })
  @IsString()
  @Length(3, 50)
  name?: string | null;

  @Column({ type: 'varchar', length: 250, nullable: false, unique: false })
  @IsString()
  @Length(3, 250)
  description?: string | null;

  @Column({ nullable: false })
  billingId?: string;
  @ManyToOne(() => Billing, (billing) => billing.processes)
  @JoinColumn({ name: 'billingId' })
  billing?: Billing;

  public constructor(params?: Iprocess) {
    super();
    if (params) {
      this.name = params.name;
      this.description = params.description;
      typeof params.billing === 'string'
        ? (this.billingId = params.billing)
        : (this.billing = params.billing);
    }
  }
  public update(params: Iprocess): void {
    this.name = params.name ? params.name : null;
    this.description = params.description ? params.description : null;
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
