export interface IS3Service {
  /**
   *
   * @param field
   * @param userId
   * @param originalName
   * @returns
   */
  generateS3Key: (userId: string, originalName: string) => Promise<string>;
  /**
   * Upload a file from a buffer to S3 and return a signed URL
   * @param fileBuffer - File content as Buffer
   * @param key - S3 key/path (e.g., 'avatars/file.png')
   * @param mimeType - MIME type of the file
   * @param expiresIn - Signed URL expiration in seconds (default: 3600)
   */
  uploadFileFromStream: (
    filePath: string,
    key: string,
    mimeType: string,
    expiresIn: number,
  ) => Promise<string>;

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

  generatePresignedPutUrl(
    userId: string,
    originalName: string,
    mimeType: string,
  ): Promise<{ uploadUrl: string; key: string }>;
}
