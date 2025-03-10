import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum, Synchronization } from './entities/synchronization.entity';
import { In, Repository } from 'typeorm';
import { CreateSynchronization } from './synchronizations.types';

@Injectable()
export class SynchronizationsService {
  constructor(
    @InjectRepository(Synchronization)
    private synchronizationsRepo: Repository<Synchronization>,
  ) {}

  async create(createItem: CreateSynchronization): Promise<Synchronization> {
    return this.synchronizationsRepo.save(createItem);
  }

  async findLast(): Promise<Synchronization> {
    return this.synchronizationsRepo.findOne({
      where: { status: In([StatusEnum.SUCCESS, StatusEnum.WARNING]) },
      order: { endDate: 'DESC' },
    });
  }
}
