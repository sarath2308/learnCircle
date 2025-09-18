import type { ILearner } from "../../models/Learner";
import { Model, Document } from "mongoose";
import { CreateLearnerDTO } from "../../DTO/createLearnerDto";

export interface ILearnerRepo<T> {
  getUsers: () => Promise<Array<T>>;
  create: (userData: CreateLearnerDTO) => Promise<T | null>;
  findById: (id: string) => Promise<T | null>;
  findByEmail: (email: string) => Promise<T | null>;
  update: (id: string, data: Partial<T>) => Promise<T | null>;
}

export class LearnerRepo implements ILearnerRepo<ILearner> {
  async getUsers(): Promise<Array<ILearner>> {
    try {
      const Users = await this.Learner.find();
      return Users;
    } catch (err) {
      console.log(err);
      throw new Error("error occured in geting all Learner");
    }
  }
  constructor(private Learner: Model<ILearner & Document>) {}
  async create(userData: CreateLearnerDTO): Promise<ILearner> {
    try {
      const User = await this.Learner.create(userData);
      return User;
    } catch (err) {
      console.log(err);
      throw new Error("error occured in creating Learner");
    }
  }
  async findById(id: string): Promise<ILearner | null> {
    try {
      const User = await this.Learner.findById(id).exec();
      return User;
    } catch (error) {
      console.error(error);
      throw new Error("couldn't find the user");
    }
  }
  async findByEmail(email: string): Promise<ILearner | null> {
    try {
      const User = await this.Learner.findOne({ email: email });
      return User;
    } catch (error) {
      console.error(error);
      throw new Error("couldn't find the user");
    }
  }
  async update(id: string, data: Partial<ILearner>): Promise<ILearner | null> {
    try {
      const User = await this.Learner.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
      return User;
    } catch (error) {
      console.error(error);
      throw new Error("couldn't update the user");
    }
  }
}
