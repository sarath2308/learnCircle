import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export class CloudinaryService {
  async uploadImage(buffer: Buffer, publicId: string, folder = "profiles"): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, public_id: publicId, resource_type: "auto" }, (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url!);
        })
        .end(buffer);
    });
  }

  generateSignedUrl(publicId: string, folder = "profiles", expiresInSec = 3600): string {
    const fullPublicId = `${folder}/${publicId}`;
    return cloudinary.url(fullPublicId, {
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + expiresInSec,
    });
  }
}
