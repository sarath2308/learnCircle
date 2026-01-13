export interface ILessons {
  id?: string;
  chapterId: string;
  title: string;
  description: string;
  type: "Video" | "PDF" | "Article" | "YouTube" | "Blog";
  fileUrl?: string;
  link?: string;
  thumbnailUrl: string;
  mediaStatus: "ready" | "pending" | "uploaded" | "failed";
  order: number;
}
