import Busboy from "busboy";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { Request, Response, NextFunction } from "express";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      files?: Record<string, { path: string; mimeType: string; originalName: string }>;
      body?: Record<string, any>;
    }
  }
}

export const busboyUpload = (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") return next();

  // Ensure tmp/uploads exists
  const uploadDir = path.join(process.cwd(), "tmp", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  req.files = {};
  req.body = {};

  const busboy = new Busboy({ headers: req.headers });

  busboy.on("file", (fieldname, file, info) => {
    const { filename, mimeType } = info;
    const extension = path.extname(filename);
    const uniqueName = `${uuid()}${extension}`;
    const tempFilePath = path.join(uploadDir, uniqueName);

    const writeStream = fs.createWriteStream(tempFilePath);
    file.pipe(writeStream);

    // Register file metadata
    req.files![fieldname] = {
      path: tempFilePath,
      mimeType,
      originalName: filename,
    };

    file.on("error", (err) => next(err));
    writeStream.on("error", (err) => next(err));
  });

  busboy.on("field", (fieldname, value) => {
    // Accumulate multiple values with same fieldname into an array
    if (Object.prototype.hasOwnProperty.call(req.body, fieldname)) {
      const cur = req.body[fieldname];
      if (Array.isArray(cur)) {
        cur.push(value);
      } else {
        req.body[fieldname] = [cur, value];
      }
    } else {
      req.body[fieldname] = value;
    }
  });

  busboy.on("finish", () => {
    next();
  });

  busboy.on("error", (err) => {
    res.status(400).json({ message: "Failed to parse multipart data", detail: err.message });
  });

  req.pipe(busboy);
};
