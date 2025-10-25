import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import dotenv from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Buffer } from "buffer";
import { IS3Service } from "../interface";
import { randomUUID } from "crypto";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME!;

export class S3Service implements IS3Service {
  /**
   *
   * @param field
   * @param userId
   * @param originalName
   * @returns
   */
  async generateS3Key(userId: string, originalName: string): Promise<string> {
    // Extract extension safely
    const extension = originalName.includes(".")
      ? originalName.substring(originalName.lastIndexOf("."))
      : "";

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const uniqueId = randomUUID();

    return `${userId}/${year}/${month}/${day}/${uniqueId}${extension}`;
  }

  /**
   * Upload file from buffer and return signed URL
   */
  async uploadFileFromBuffer(fileBuffer: Buffer, key: string, mimeType: string, expiresIn = 3600) {
    // Upload to S3
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // Return signed URL
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn });

    return signedUrl;
  }

  /**
   * Get a signed URL for an existing file
   */
  async getFileUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });

    return await getSignedUrl(s3, command, { expiresIn });
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });

    await s3.send(command);

    return { message: "File deleted successfully" };
  }
}
