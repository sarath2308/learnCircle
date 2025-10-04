import { TYPES } from "../../types/types";
import { inject, injectable } from "inversify";
import { LearnerProfileService } from "../../services/learner/learner.profile.service";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messages";
interface AuthRequest extends Request {
  user: { userId: string; role: string };
}

@injectable()
export class LearnerProfileController {
  constructor(@inject(TYPES.LearnerProfileService) private service: LearnerProfileService) {}
  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { userId } = req?.user;
      let response = await this.service.getProfile(userId);
      return res.status(HttpStatus.OK).json({ user: response, message: "profile fetched" });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
    }
  }
  async uploadProfilePhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      console.log("req hit");
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const { userId } = req.user;
      let result = await this.service.uploadProfilePhoto(userId, req.file.buffer);

      return res
        .status(HttpStatus.ACCEPTED)
        .json({ profileImg: result, message: "profile image updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let { userId } = req.user;
      let { name } = req.body;
      let result = await this.service.updateProfile(userId, name);
      return res.status(HttpStatus.ACCEPTED).json({ user: result, message: "profile updated" });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
    }
  }
}
