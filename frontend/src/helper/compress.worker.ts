import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

// Worker-local FFmpeg instance
const ffmpeg = new FFmpeg();
let loaded = false;

self.onmessage = async (e: MessageEvent<File>) => {
  const file = e.data;

  try {
    if (!loaded) {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

      await ffmpeg.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL: `${baseURL}/ffmpeg-core.wasm`,
        workerURL: `${baseURL}/ffmpeg-core.worker.js`,
      });

      loaded = true;
    }

    const inputName = "input.mp4";
    const outputName = "output.mp4";

    await ffmpeg.writeFile(inputName, await fetchFile(file));

    await ffmpeg.exec([
      "-i",
      inputName,
      "-vcodec",
      "libx264",
      "-crf",
      "28",
      "-preset",
      "veryfast",
      "-vf",
      "scale=1280:-2",
      "-movflags",
      "+faststart",
      outputName,
    ]);

    const data = await ffmpeg.readFile(outputName);

    const arrayBuffer: ArrayBuffer =
      typeof data === "string"
        ? new TextEncoder().encode(data).buffer
        : new Uint8Array(data).slice().buffer;

    const compressedFile = new File([arrayBuffer], `compressed-${file.name}`, {
      type: "video/mp4",
    });

    // ✅ success response
    self.postMessage({ success: true, file: compressedFile });
  } catch (err) {
    // ❌ error response
    self.postMessage({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  } finally {
    try {
      await ffmpeg.deleteFile("input.mp4");
    } catch {}
    try {
      await ffmpeg.deleteFile("output.mp4");
    } catch {}
  }
};
