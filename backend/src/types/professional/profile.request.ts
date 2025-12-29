import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";

export interface ProfileRequest extends IAuthRequest {
  avatar?: Express.Multer.File;
  resumeFile?: Express.Multer.File; // rename to avoid conflict
}
