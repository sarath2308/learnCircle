import { injectable, inject } from "inversify";
import { TYPES } from "../../types/types";
import { ProfesionalRepo } from "../../Repositories/profesional/profesionalRepo";
import { CloudinaryService } from "../../utils/cloudinary.service";
import { uuid } from "zod";
import { CloudFiles } from "../../constants/cloudinary.folder";
import { mapToProfileInfo } from "../../dtos/profesional/profesionaInfo.mapper";
import { mapProfessionalToDTO } from "../../dtos/profesional/profesional.mapper";
interface UploadFiles {
  avatar?: Buffer;
  resume?: Buffer;
}

@injectable()
export class ProfesionalVerificationService {
  constructor(
    @inject(TYPES.ProfesionalRepo) private repo: ProfesionalRepo,
    @inject(TYPES.CloudinaryService) private cloudinary: CloudinaryService,
  ) {}

  async uploadData(userId: string, data: any, files: UploadFiles) {
    const publicId = `user_profile${userId}_${uuid()}`;
    const resumeId = `user_resume${userId}_${uuid()}`;
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (files.avatar) {
      await this.cloudinary.uploadImage(files.avatar, CloudFiles.Profile);
    }
    if (files.resume) {
      await this.cloudinary.uploadImage(files.resume, CloudFiles.Resume);
    }
    let profileInfo = mapToProfileInfo({ ...data, resumeId });
    let updated = await this.repo.update(userId, { publicId, status: "processing", profileInfo });
    return { user: updated };
  }
  async getDashboard(userId: string) {
    let user = await this.repo.findById(userId);
    if (user) {
      return mapProfessionalToDTO(user);
    } else {
      throw new Error("user not found");
    }
  }
}
