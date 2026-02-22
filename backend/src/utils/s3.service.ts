import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import { IS3Service } from "@/interface/shared/s3.service.interface";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
});

function getBucketName() {
  if (!process.env.AWS_S3_BUCKET_NAME) {
    throw new Error("AWS_S3_BUCKET_NAME is not set");
  }
  return process.env.AWS_S3_BUCKET_NAME;
}

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
   * Upload file from Stream and return signed URL
   */
  async uploadFileFromStream(
    filePath: string,
    key: string,
    mimeType: string,
    expiresIn = Number(process.env.S3_URL_EXPIRES_IN),
  ) {
    const fileStream = fs.createReadStream(filePath);

    const uploadParams = {
      Bucket: getBucketName(),
      Key: key,
      Body: fileStream,
      ContentType: mimeType,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const command = new GetObjectCommand({ Bucket: getBucketName(), Key: key });
    return await getSignedUrl(s3, command, { expiresIn });
  }

  /**
   * Get a signed URL for an existing file
   */
  async getFileUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({ Bucket: getBucketName(), Key: key });

    return await getSignedUrl(s3, command, { expiresIn });
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({ Bucket: getBucketName(), Key: key });

    await s3.send(command);

    return { message: "File deleted successfully" };
  }
  /**
   *
   * @param userId
   * @param originalName
   * @param mimeType
   * @returns
   * Generating pre-signed url for frontend video upload
   */
  async generatePresignedPutUrl(
    userId: string,
    originalName: string,
    mimeType: string,
  ): Promise<{ uploadUrl: string; key: string }> {
    const key = await this.generateS3Key(userId, originalName);

    const command = new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      ContentType: mimeType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    return { uploadUrl: url, key };
  }
}
