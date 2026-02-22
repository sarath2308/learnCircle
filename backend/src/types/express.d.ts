declare global {
  namespace Express {
    interface Request {
      uploadedFiles?: Record<string, { path: string; mimeType: string; originalName: string }>;
    }
  }
}
