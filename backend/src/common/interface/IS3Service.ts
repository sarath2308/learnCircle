import { Buffer } from "buffer";

export interface IS3Service {
  /**
   * Upload a file from a buffer to S3 and return a signed URL
   * @param fileBuffer - File content as Buffer
   * @param key - S3 key/path (e.g., 'avatars/file.png')
   * @param mimeType - MIME type of the file
   * @param expiresIn - Signed URL expiration in seconds (default: 3600)
   */
  uploadFileFromBuffer(
    fileBuffer: Buffer,
    key: string,
    mimeType: string,
    expiresIn?: number,
  ): Promise<string>;

  /**
   * Generate a signed URL for an existing S3 file
   * @param key - S3 key/path
   * @param expiresIn - Signed URL expiration in seconds (default: 3600)
   */
  getFileUrl(key: string, expiresIn?: number): Promise<string>;

  /**
   * Delete a file from S3
   * @param key - S3 key/path
   */
  deleteFile(key: string): Promise<{ message: string }>;
}
