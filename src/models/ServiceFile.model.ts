import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  BaseEntity
} from 'typeorm';
import { IsUUID, validateOrReject } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'service_file' })
export default class ServiceFile extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
  @IsUUID()
  id?: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  lock?: boolean;

  @Column({ type: 'varchar', nullable: false })
  name?: string;

  public constructor() {
    super();
    this.lock = false;
    this.name = uuidv4();
  }

  @BeforeInsert()
  async validateModel() {
    this.id = uuidv4();
    await validateOrReject(this, {
      validationError: { value: true, target: false }
    });
  }
}
