import multer, { FileFilterCallback, MulterError } from "multer";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      // Compatible with the original multer definition
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
      // Optional helper for single-file-per-field access
      uploadedFiles?: Record<string, Express.Multer.File>;
    }
  }
}

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  cb(null, true); // accept all
};

export const multerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer({ storage, fileFilter }).any();

  upload(req, res, (err: any) => {
    if (err) {
      if (err instanceof MulterError) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "File upload failed." });
    }

    // Safely flatten files into a single-file dictionary for easy access
    req.uploadedFiles = {};

    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        req.uploadedFiles[file.fieldname] = file;
      }
    } else if (req.files && typeof req.files === "object") {
      for (const [field, files] of Object.entries(req.files)) {
        if (Array.isArray(files) && files[0]) {
          req.uploadedFiles[field] = files[0];
        }
      }
    }

    next();
  });
};
