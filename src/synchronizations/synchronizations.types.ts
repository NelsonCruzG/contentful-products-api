import { StatusEnum } from './entities/synchronization.entity';

export type CreateSynchronization = {
  startDate: Date;
  endDate: Date;
  updatedRecords: number;
  createdRecords: number;
  removedRecords: number;
  status: StatusEnum;
  errorMessage?: string;
};
