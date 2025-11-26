import sharp from "sharp";
import path from "path";
import { ICompressor } from "@/interface/shared/compressor.interface";

export class ImageCompressor implements ICompressor {
  async compress(inputPath: string): Promise<string> {
    const outputPath = this.getOutputPath(inputPath);

    await sharp(inputPath)
      .resize({
        width: 1280,
        height: 720,
        fit: "inside",
      })
      .jpeg({ quality: 70 })
      .toFile(outputPath);

    return outputPath;
  }

  private getOutputPath(input: string): string {
    const ext = path.extname(input);
    const base = path.basename(input, ext);
    const dir = path.dirname(input);
    return path.join(dir, `${base}-compressed${ext}`);
  }
}
