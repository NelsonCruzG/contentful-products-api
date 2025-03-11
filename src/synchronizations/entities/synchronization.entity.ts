import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

export enum StatusEnum {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

@Entity('synchronizations')
export class Synchronization {
  @PrimaryGeneratedColumn({ name: 'synchronization_id' })
  synchronizationId: number;

  @Column({
    name: 'start_date',
    type: 'timestamp with time zone',
  })
  @Index()
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'timestamp with time zone',
    default: null,
  })
  @Index()
  endDate: Date;

  @Column({
    name: 'updated_records',
    default: 0,
  })
  @Index()
  updatedRecords: number;

  @Column({
    name: 'created_records',
    default: 0,
  })
  @Index()
  createdRecords: number;

  @Column({
    name: 'removed_records',
    default: 0,
  })
  @Index()
  removedRecords: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.SUCCESS,
  })
  @Index()
  status: string;

  @Column({ name: 'error_message', nullable: true })
  @Index()
  errorMessage?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @BeforeInsert()
  updateUnsetDate() {
    if (!this.endDate) {
      this.endDate = new Date();
    }
  }
}
