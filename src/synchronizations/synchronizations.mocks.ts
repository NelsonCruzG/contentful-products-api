import { StatusEnum, Synchronization } from './entities/synchronization.entity';
import { CreateSynchronization } from './synchronizations.types';

const dateMock = new Date('2025-01-01');

export const synchronizationCreateMock: CreateSynchronization = {
  status: StatusEnum.SUCCESS,
  startDate: dateMock,
  endDate: dateMock,
  updatedRecords: 10,
  createdRecords: 10,
  removedRecords: 10,
};

export const synchronizationMock: Synchronization = {
  synchronizationId: 1,
  status: StatusEnum.SUCCESS,
  startDate: dateMock,
  endDate: dateMock,
  updatedRecords: 10,
  createdRecords: 10,
  removedRecords: 10,
  createdAt: dateMock,
  updatedAt: dateMock,
  updateUnsetDate: jest.fn(),
};
