import type { Document, Model } from 'mongoose';

export abstract class BaseRepository<TDoc extends Document, TEntity> {
  protected model: Model<TDoc>;

  constructor(model: Model<TDoc>) {
    this.model = model;
  }

  protected abstract toDomain(doc: TDoc): TEntity;

  async create(data: Partial<TDoc>): Promise<TEntity> {
    const doc = await this.model.create(data as any);
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<TEntity | null> {
    const doc = await this.model.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(): Promise<TEntity[]> {
    const docs = await this.model.find();
    return docs.map((d) => this.toDomain(d));
  }

  async update(id: string, data: Partial<TDoc>): Promise<TEntity | null> {
    const doc = await this.model.findByIdAndUpdate(id, data as any, { new: true });
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.model.findByIdAndDelete(id);
    return res != null;
  }
}
