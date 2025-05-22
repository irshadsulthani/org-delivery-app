// src/domain/repositories/interfaces/IBaseRepository.ts
import { UpdateQuery } from 'mongoose';

export interface IBaseRepository<T, TDocument> {
  create(item: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<boolean>;
  update(id: string, item: UpdateQuery<TDocument>): Promise<T | null>;
}
