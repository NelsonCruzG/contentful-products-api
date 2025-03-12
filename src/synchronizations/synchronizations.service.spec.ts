import { Test, TestingModule } from '@nestjs/testing';
import { SynchronizationsService } from './synchronizations.service';
import { createMockRepository, MockRepository } from '../mocks/repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Synchronization } from './entities/synchronization.entity';
import {
  synchronizationCreateMock,
  synchronizationMock,
} from './synchronizations.mocks';

describe('SynchronizationsService', () => {
  let service: SynchronizationsService;
  let repository: MockRepository;
  let synchronizationRepoToken = getRepositoryToken(Synchronization);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SynchronizationsService,
        {
          provide: synchronizationRepoToken,
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<SynchronizationsService>(SynchronizationsService);
    repository = module.get<MockRepository>(synchronizationRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Should create and return the synchronization', async () => {
      repository.save.mockReturnValue(synchronizationMock);
      const synchronization = await service.create(synchronizationCreateMock);
      expect(synchronization).toEqual(synchronizationMock);
    });
  });

  describe('findLast', () => {
    it('Should return the last synchronization', async () => {
      repository.findOne.mockReturnValue(synchronizationMock);
      const synchronization = await service.findLast();
      expect(synchronization).toEqual(synchronizationMock);
    });
  });
});
