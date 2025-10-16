import { NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@/common";
import { ProfesionalVerificationService } from "@/professionals";
import { Response } from "express";
import { HttpStatus } from "@/common";
import { Messages } from "@/common";
interface AuthRequest extends Request {
  user: { userId: string; role: string };
  avatar?: Express.Multer.File;
  resume?: Express.Multer.File;
}
@injectable()
export class ProfesionalVerificationController {
  constructor(
    @inject(TYPES.ProfesionalVerificationService) private service: ProfesionalVerificationService,
  ) {}

  async verification(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { userId } = req.user;

      if (!req.avatar && !req.resume) {
        return res.status(400).json({ message: "Avatar or resume file is required." });
      }

      const avatarBuffer = req.avatar?.buffer;
      const resumeBuffer = req.resume?.buffer;

      await this.service.uploadData(userId, req.body, {
        avatar: avatarBuffer,
        resume: resumeBuffer,
      });

      return res.status(200).json({ message: "Files uploaded successfully." });
    } catch (error) {
      next(error);
    }
  }
  async getDashboard(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.user;
      const result = await this.service.getDashboard(userId);
      return res.status(HttpStatus.OK).json({ user: result, message: "data fetched" });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
    }
  }
}
