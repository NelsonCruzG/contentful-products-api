import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

export type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  count: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
});

export type MockHttpService = Partial<Record<keyof HttpService, jest.Mock>>;
export const createMockHttpService = (): MockHttpService => ({
  get: jest.fn(),
});

export type MockJwtService = Partial<Record<keyof JwtService, jest.Mock>>;
export const createMockJwtService = (): MockJwtService => ({
  sign: jest.fn(),
});
