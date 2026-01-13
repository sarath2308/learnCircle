import { Modal } from "@/components/Modal";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";

interface ResourceViewerModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    type: string;
    url?: string;
  } | null;
}

function normalizeYouTubeUrl(url: string) {
  if (url.includes("embed")) return url;

  const match =
    url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);

  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : url;
}

function renderResource(type: string, url?: string) {
  if (!url) {
    return (
      <p className="text-red-500 text-sm">
        Resource URL is missing.
      </p>
    );
  }

  switch (type) {
    case LESSON_TYPES.VIDEO:
      return (
        <video
          src={url}
          controls
          autoPlay
          className="w-full rounded-lg"
        />
      );

    case LESSON_TYPES.YOUTUBE:
      return (
        <iframe
          src={normalizeYouTubeUrl(url)}
          className="w-full aspect-video rounded-lg"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      );

    case LESSON_TYPES.PDF:
    case LESSON_TYPES.ARTICLE:
      return (
        <iframe
          src={url}
          className="w-full h-[75vh] rounded-lg border"
        />
      );

    default:
      return (
        <p className="text-gray-500 text-sm">
          Unsupported resource type.
        </p>
      );
  }
}


export function ResourceViewerModal({
  open,
  onClose,
  data,
}: ResourceViewerModalProps) {
  if (!open || !data) return null;

  const { type, url } = data;

  return (
    <Modal open={open} onClose={onClose} title="Resource">
      <div className="w-full">
        {renderResource(type, url)}
      </div>
    </Modal>
  );
}
