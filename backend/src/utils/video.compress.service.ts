import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";
import { ICompressor } from "@/interface/shared/compressor.interface";

export class VideoCompressor implements ICompressor {
  constructor() {
    // Force fluent-ffmpeg to use the bundled ffmpeg binary
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  }

  async compress(inputPath: string): Promise<string> {
    const outputPath = this.getOutputPath(inputPath);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions(["-vcodec libx264", "-crf 28", "-preset veryfast"])
        .save(outputPath)
        .on("end", () => resolve())
        .on("error", (err) => reject(err));
    });

    return outputPath;
  }

  private getOutputPath(input: string): string {
    const ext = path.extname(input);
    const base = path.basename(input, ext);
    const dir = path.dirname(input);
    return path.join(dir, `${base}-compressed${ext}`);
  }
}
