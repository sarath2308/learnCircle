import { useMutation } from "@tanstack/react-query";

export function useUploadToS3() {
  return useMutation({
    mutationFn: async ({
      signedUrl,
      file,
      onProgress,
    }: {
      signedUrl: string;
      file: File;
      onProgress: (p: number) => void;
    }) => {
      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("PUT", signedUrl, true);
        xhr.setRequestHeader("Content-Type", "video/mp4");

        xhr.upload.onprogress = (e) => {
          if (!e.lengthComputable) return;
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during S3 upload"));

        xhr.send(file);
      });
    },
  });
}
