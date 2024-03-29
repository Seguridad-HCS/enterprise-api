import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  PrimaryColumn,
  BaseEntity
} from 'typeorm';
import { IsString, IsUUID, Length, validateOrReject } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import Position from 'models/Position.model';

interface InewDepartment {
  name: string;
  description: string;
}

@Entity({ name: 'department' })
export default class Department extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
  @IsUUID()
  id?: string;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  @IsString()
  @Length(3, 30)
  name!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  @IsString()
  @Length(3, 150)
  description!: string;

  @OneToMany(() => Position, (position) => position.department)
  positions: Position[] | undefined;

  public constructor(params: InewDepartment) {
    super();
    if (params) {
      this.name = params.name;
      this.description = params.description;
    }
  }

  @BeforeInsert()
  async validateModel(): Promise<void> {
    this.id = uuidv4();
    await validateOrReject(this, {
      validationError: { value: true, target: false }
    });
  }
}
