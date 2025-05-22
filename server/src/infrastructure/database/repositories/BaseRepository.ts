import { Document, Model, UpdateQuery } from 'mongoose';
import { IBaseRepository } from './interface/IBaseRepository';

export abstract class BaseRepository<T, TDocument extends Document>
  implements IBaseRepository<T, TDocument>
{
  protected constructor(protected readonly model: Model<TDocument>) {}

  async create(item: T): Promise<T> {
    const newItem = new this.model(item);
    const savedItem = await newItem.save();
    return this.toObject(savedItem);
  }

  async findById(id: string): Promise<T | null> {
    const item = await this.model.findById(id);
    return item ? this.toObject(item) : null;
  }

  async findAll(): Promise<T[]> {
    const items = await this.model.find();
    return items.map(item => this.toObject(item));
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async update(id: string, item: UpdateQuery<TDocument>): Promise<T | null> {
    const updatedDoc = await this.model.findByIdAndUpdate(id, item, {
      new: true,
      runValidators: true,
    });
    return updatedDoc ? this.toObject(updatedDoc as TDocument) : null;
  }

  protected toObject(document: TDocument): T {
    const obj = document.toObject();
    return {
      ...obj,
      _id: obj._id.toString(),
    };
  }
}
