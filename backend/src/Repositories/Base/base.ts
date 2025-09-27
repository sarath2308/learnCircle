import { Model, Document } from "mongoose";

export interface IBaseRepo<T> {
  getAll: () => Promise<Array<T & Document>>;
  create: (userData: Partial<T>) => Promise<T & Document>;
  findById: (id: string) => Promise<(T & Document) | null>;
  findByEmail: (email: string) => Promise<(T & Document) | null>;
  update: (id: string, data: Partial<T>) => Promise<(T & Document) | null>;
  delete: (id: string) => Promise<(T & Document) | null>;
}

export class BaseRepo<T> implements IBaseRepo<T> {
  constructor(protected model: Model<T & Document>) {}

  async getAll(): Promise<Array<T & Document>> {
    try {
      return await this.model.find().exec();
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while fetching all records");
    }
  }

  async create(data: Partial<T>): Promise<T & Document> {
    try {
      return await this.model.create(data);
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while creating record");
    }
  }

  async findById(id: string): Promise<(T & Document) | null> {
    try {
      let result = await this.model.findById(id).exec();
      return result;
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while finding record by ID");
    }
  }

  async findByEmail(email: string): Promise<(T & Document) | null> {
    try {
      return await this.model.findOne({ email }).exec();
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while finding record by email");
    }
  }

  async update(id: string, data: Partial<T>): Promise<(T & Document) | null> {
    try {
      const user = await this.model.findByIdAndUpdate(id, data as any, { new: true }).exec();
      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Couldn't update the user");
    }
  }

  async delete(id: string): Promise<(T & Document) | null> {
    try {
      return await this.model.findByIdAndDelete(id).exec();
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while deleting record");
    }
  }
}
