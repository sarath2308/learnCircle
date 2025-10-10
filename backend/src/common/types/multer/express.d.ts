import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
      avatar?: Multer.File;
      resume?: Multer.File;
    }
  }
}
