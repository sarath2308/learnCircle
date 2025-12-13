import { IAuthRequest } from "@/interface/shared/auth/IAuthRequest";

export interface ProfileRequest extends IAuthRequest {
  avatar?: Express.Multer.File;
  resumeFile?: Express.Multer.File; // rename to avoid conflict
}
