import { Model, Document,UpdateQuery} from "mongoose";

export interface IBaseRepo<T>
{
    getAll:()=>Promise<Array<T>>
    create:(userData:any)=>Promise<T| null>;
    findById:(id:string)=>Promise<T| null>
    findByEmail:(email:string)=>Promise<T | null>
    update:(id:string,data:Partial<T>)=>Promise<T| null>
}

export class BaseRepo<T> {
  constructor(protected model: Model<T & Document>) {}

  async getAll(): Promise<T[]> {
    try {
      return await this.model.find().exec();
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while fetching all records");
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.model.create(data);
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while creating record");
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while finding record by ID");
    }
  }


async update(id: string, data:any): Promise<T | null> {
  try {
    const User = await this.model.findByIdAndUpdate(
      id,               
      { $set: data },   
      { new: true }     
    ).exec();
    return User;
  } catch (error) {
    console.error(error);
    throw new Error("couldn't update the user");
  }
}


  async delete(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id).exec();
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while deleting record");
    }
  }
}
