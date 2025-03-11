import { ObjectLiteral, Repository } from 'typeorm';

export type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  count: jest.fn(),
  findOne: jest.fn(),
});
