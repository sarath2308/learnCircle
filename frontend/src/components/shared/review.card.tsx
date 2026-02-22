import React, { useState } from "react";
import { Pencil, Trash2, X, Star } from "lucide-react";
import type { IReviewType } from "@/types/shared/review.type";

interface ReviewProps {
  review: IReviewType;
  variant: "author" | "viewer";
  onUpdate: (id: string, data: { rating: number; comment: string }) => void;
  onDelete: (id: string) => void;
}

export const ReviewItem: React.FC<ReviewProps> = ({ review, variant, onUpdate, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedComment, setEditedComment] = useState(review.comment);
  const [editedRating, setEditedRating] = useState(review.rating);

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {review.createdAt}
          </p>
        </div>

        {variant === "author" && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-full transition"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(review.id)}
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
        {review.comment}
      </p>

      {/* Inline Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase tracking-tight">Edit Review</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editedRating}
                  onChange={(e) => setEditedRating(Number(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                  Comment
                </label>
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 h-32 font-medium resize-none"
                />
              </div>
              <button
                onClick={() => {
                  onUpdate(review.id, { rating: editedRating, comment: editedComment });
                  setIsEditModalOpen(false);
                }}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 transition-all shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
