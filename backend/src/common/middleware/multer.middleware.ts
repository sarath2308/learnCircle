import multer, { FileFilterCallback, MulterError } from "multer";
import { Request, Response, NextFunction } from "express";

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

// Extend Express Request type
declare module "express-serve-static-core" {
  interface Request {
    avatar?: Express.Multer.File;
    resume?: Express.Multer.File;
  }
}

const storage = multer.memoryStorage();

// Allowed MIME types
const allowedMimeTypes: { [key: string]: string[] } = {
  avatar: ["image/jpeg", "image/png"],
  resume: ["application/pdf"],
};

// File size limits in bytes
const fileSizeLimits: { [key: string]: number } = {
  avatar: 2 * 1024 * 1024, // 2 MB
  resume: 5 * 1024 * 1024, // 5 MB
};

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowed = allowedMimeTypes[file.fieldname];
  if (!allowed) {
    return cb(new Error(`No configuration for field "${file.fieldname}"`));
  }

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${allowed.join(", ")}`));
  }

  // Check file size
  const maxSize = fileSizeLimits[file.fieldname];
  if (maxSize && file.size > maxSize) {
    return cb(new MulterError("LIMIT_FILE_SIZE", file.fieldname));
  }

  cb(null, true);
};

// Middleware
export const multerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer({ storage, fileFilter }).any();

  upload(req, res, (err: any) => {
    if (err) {
      if (err instanceof MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: `${err.field} exceeds the maximum allowed file size.`,
          });
        }
        return res.status(400).json({ message: err.message });
      }

      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }

      return res.status(500).json({ message: "Something went wrong during file upload." });
    }

    // Map files to req.avatar and req.resume
    if (req.files) {
      (req.files as Express.Multer.File[]).forEach((file) => {
        if (file.fieldname === "avatar") req.avatar = file;
        if (file.fieldname === "resume") req.resume = file;
      });
    }

    next();
  });
};
