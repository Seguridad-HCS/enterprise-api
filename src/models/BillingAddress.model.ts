import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  BeforeUpdate
} from 'typeorm';
import {
  IsOptional,
  IsString,
  IsUUID,
  Length,
  validateOrReject
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
interface IaddressData {
  street: string;
  outNumber: string;
  intNumber: string;
  neighborhood: string;
  zip: string;
  municipality: string;
  state: string;
}

@Entity({ name: 'billing_address' })
export default class BillingAddress {
  @PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
  @IsUUID()
  id?: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsString()
  @Length(5, 30)
  street!: string | null;

  @Column({ type: 'varchar', length: 12, nullable: false })
  @IsString()
  @Length(1, 12)
  intNumber!: string | null;

  @Column({ type: 'varchar', length: 12 })
  @IsString()
  @Length(1, 12)
  @IsOptional()
  outNumber!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsString()
  @Length(5, 30)
  neighborhood!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsString()
  @Length(5, 30)
  municipality!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsString()
  @Length(4, 30)
  state!: string | null;

  @Column({ type: 'varchar', length: 10, nullable: false })
  @IsString()
  @Length(1, 10)
  zip!: string | null;

  public constructor(params?: IaddressData) {
    if (params) {
      this.street = params.street;
      this.intNumber = params.intNumber;
      this.outNumber = params.outNumber;
      this.neighborhood = params.neighborhood;
      this.municipality = params.municipality;
      this.state = params.state;
      this.zip = params.zip;
    }
  }

  public update(params: IaddressData): void {
    this.street = params.street ? params.street : null;
    this.intNumber = params.intNumber ? params.intNumber : null;
    this.outNumber = params.outNumber ? params.outNumber : null;
    this.neighborhood = params.neighborhood ? params.neighborhood : null;
    this.municipality = params.municipality ? params.municipality : null;
    this.state = params.state ? params.state : null;
    this.zip = params.zip ? params.zip : null;
    return;
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
