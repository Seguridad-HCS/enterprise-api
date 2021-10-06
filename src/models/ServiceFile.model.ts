import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  BaseEntity,
  AfterRemove
} from 'typeorm';
import { IsUUID, validateOrReject } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import path from 'path';
import * as fs from 'fs';

const deleteFileAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);

@Entity({ name: 'service_file' })
export default class ServiceFile extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, nullable: false })
  @IsUUID()
  id?: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  lock!: boolean;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  public constructor() {
    super();
    this.lock = false;
    this.name = uuidv4();
  }

  public async setFile(file: Express.Multer.File): Promise<void> {
    await writeFileAsync(
      path.resolve(__dirname, '../../../files', this.name),
      file.buffer
    );
    return;
  }

  public async updateFile(file: Express.Multer.File): Promise<void> {
    await deleteFileAsync(path.resolve(__dirname, '../../../files', this.name));
    await writeFileAsync(
      path.resolve(__dirname, '../../../files', this.name),
      file.buffer
    );
    return;
  }

  public getFile(): fs.ReadStream {
    const file = fs.createReadStream(
      path.resolve(__dirname, '../../../files', this.name)
    );
    return file;
  }

  @BeforeInsert()
  async validateModel(): Promise<void> {
    this.id = uuidv4();
    await validateOrReject(this, {
      validationError: { value: true, target: false }
    });
  }
  @AfterRemove()
  async deleteFile(): Promise<void> {
    await deleteFileAsync(path.resolve(__dirname, '../../files', this.name));
  }
}
