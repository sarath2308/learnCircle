import { inject, injectable } from "inversify";
import ICourseRepo, { CourseStatus } from "@/interface/shared/course/course.repo.interface";
import { ICourse } from "@/model/shared/course.model";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
import { BaseRepo } from "./base";
import { CoursePopulated } from "@/types/learner/course/course.home.card.type";

@injectable()
export class CourseRepo extends BaseRepo<ICourse> implements ICourseRepo {
  constructor(@inject(TYPES.ICourseModel) private _model: Model<ICourse>) {
    super(_model);
  }

  async updatePrice(
    id: string,
    payload: { price: number; discount: number; type: "Free" | "Paid" },
  ): Promise<void> {
    const { price, discount, type } = payload;
    await this._model.updateOne(
      { _id: id },
      { $set: { price, discount, type } },
      { runValidators: true },
    );
  }

  async updateThumbnail(id: string, key: string): Promise<boolean> {
    const result = await this._model.updateOne({ _id: id }, { $set: { thumbnail_key: key } });

    return result.modifiedCount === 1;
  }

  async getCourseWithTitle(title: string): Promise<ICourse | null> {
    return await this._model.findOne({ title: title, isDeleted: false });
  }

  async increaseChapterCount(courseId: string): Promise<ICourse | null> {
    return await this._model.findByIdAndUpdate(
      courseId,
      { $inc: { chapterCount: 1 } },
      { new: true },
    );
  }

  async decreaseChapterCount(courseId: string): Promise<ICourse | null> {
    return await this._model.findByIdAndUpdate(
      courseId,
      { $inc: { chapterCount: -1 } },
      { new: true },
    );
  }

  async getAllCourse(skip: number, limit: number): Promise<ICourse[] | null> {
    return await this._model
      .find({ status: { $ne: "draft" } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("createdBy")
      .populate("category");
  }
  async getTotalCourseCount(): Promise<number> {
    return await this._model.countDocuments({ status: { $ne: "draft" } });
  }

  async findById(id: string): Promise<ICourse | null> {
    return await this._model
      .findOne({ _id: id, isDeleted: false })
      .populate("category")
      .populate("createdBy");
  }

  async getCourseDataFromUserId(
    userId: string,
    query: {
      status?: CourseStatus;
      search?: string;
      type?: string;
      category?: string;
      subCategory?: string;
      rating?: string;
      skillLevel?: string;
    },
  ): Promise<ICourse[]> {
    const filter: Record<string, any> = {
      createdBy: userId,
      isDeleted: false,
    };

    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    if (query.skillLevel) filter.skillLevel = query.skillLevel;
    if (query.category) filter.category = query.category;
    if (query.subCategory) filter.subCategory = query.subCategory;

    if (query.search) {
      const escapedSearch = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: escapedSearch, $options: "i" };
    }

    if (query.rating) {
      const ratingValue = Number(query.rating);
      if (!isNaN(ratingValue)) {
        filter.averageRating = { $gte: ratingValue };
      }
    }

    return this._model.find(filter).populate("category", "name");
  }

  async getAllCourseForUserHome(): Promise<CoursePopulated[]> {
    return await this._model
      .find({
        isDeleted: false,
        status: "published",
        verificationStatus: "approved",
        isBlocked: false,
      })
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("createdBy", "name role")
      .lean<CoursePopulated[]>();
  }
  async findCourseWithOutPoppulate(courseId: string): Promise<ICourse | null> {
    return await this._model.findOne({ _id: courseId, isBlocked: false, isDeleted: false });
  }
}
