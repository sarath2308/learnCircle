import { Modal } from "@/components/Modal";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";
import { FileText, PlayCircle, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceViewerModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    type: string;
    url?: string;
    title?: string;
    description?: string; // Optional: Pass lesson title for better UX
  } | null;
}

function normalizeYouTubeUrl(url: string) {
  if (url.includes("embed")) return url;
  const match = url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
}

function renderResource(type: string, url?: string) {
  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <AlertCircle size={40} className="mb-4 text-red-400" />
        <p className="font-bold">Missing Resource URL</p>
        <p className="text-xs mt-1">Please check the lesson configuration.</p>
      </div>
    );
  }

  switch (type) {
    case LESSON_TYPES.VIDEO:
      return (
        <div className="bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <video
            src={url}
            controls
            autoPlay
            controlsList="nodownload"
            className="w-full aspect-video"
          />
        </div>
      );

    case LESSON_TYPES.YOUTUBE:
      return (
        <div className="bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <iframe
            src={normalizeYouTubeUrl(url)}
            className="w-full aspect-video"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
      );

    case LESSON_TYPES.PDF:
    case LESSON_TYPES.ARTICLE:
      return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <FileText size={14} className="text-blue-500" />
              Document Viewer
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[10px] gap-1"
              onClick={() => window.open(url, "_blank")}
            >
              <ExternalLink size={12} /> Open in New Tab
            </Button>
          </div>
          <iframe src={url} className="w-full h-[70vh] bg-white" />
        </div>
      );

    default:
      return (
        <div className="p-10 text-center">
          <p className="text-slate-500 font-medium">Unsupported resource type: {type}</p>
        </div>
      );
  }
}

export function ResourceViewerModal({ open, onClose, data }: ResourceViewerModalProps) {
  if (!open || !data) return null;

  const { type, url, title, description } = data;

  return (
    <Modal open={open} onClose={onClose} title="">
      <div className="relative -mt-4 flex flex-col gap-5">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-2xl shrink-0 ${
              type === LESSON_TYPES.VIDEO || type === LESSON_TYPES.YOUTUBE
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                : "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
            }`}
          >
            {type === LESSON_TYPES.VIDEO || type === LESSON_TYPES.YOUTUBE ? (
              <PlayCircle size={24} />
            ) : (
              <FileText size={24} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                {type}
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
              {title || "Untitled Resource"}
            </h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full animate-in fade-in zoom-in-95 duration-300">
          {renderResource(type, url)}
        </div>

        {/* Description Section */}
        {description && (
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              About this lesson
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
              {description}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
