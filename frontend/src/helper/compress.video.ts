import { de } from "zod/v4/locales";

const compressInWorker = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("@/workers/videoCompress.worker.ts", import.meta.url), {
      type: "module",
    });

    worker.postMessage(file);

    worker.onmessage = (e) => {
      const { success, file, error } = e.data;

      if (success) {
        resolve(file);
      } else {
        reject(new Error(error));
      }

      worker.terminate();
    };

    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
  });
};
export default compressInWorker;
