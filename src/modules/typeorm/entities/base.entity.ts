import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export class BaseEntity {
  @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
  @DeleteDateColumn({ name: 'deleted_at' }) 'deleted_at': Date;
}
