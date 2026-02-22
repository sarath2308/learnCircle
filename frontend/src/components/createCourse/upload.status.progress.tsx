interface UploadStatusProps {
  stage: "idle" | "compress" | "upload" | "finalize";
  progress: number;
}

export function UploadStatus({ stage, progress }: UploadStatusProps) {
  return (
    <div className="space-y-2 w-full max-w-md -z-50">
      <p className="text-sm font-medium">
        {stage === "compress" && "🔧 Compressing video..."}
        {stage === "upload" && `🚀 Uploading... ${progress}%`}
        {stage === "finalize" && "🔁 Finalizing..."}
      </p>

      {stage === "upload" && (
        <p className="text-xs text-muted-foreground ">
          {progress}% uploaded — don’t close this page.
        </p>
      )}
    </div>
  );
}
