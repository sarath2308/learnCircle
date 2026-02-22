import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Modal } from "../Modal";
import { Textarea } from "../ui/textarea";
import { Button } from "@mui/material";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment?: string) => Promise<void>;
}

const ReviewModal = ({ open, onClose, onSubmit }: ReviewModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setRating(0);
      setHoverRating(0);
      setComment("");
      setError("");
    }
  }, [open]);

  const handleReviewSubmit = () => {
    // Validation
    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }

    if (comment.length > 500) {
      setError("Comment must be less than 500 characters.");
      return;
    }

    setError("");
    onSubmit(rating, comment.trim() || undefined);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Rate this Course</h2>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
        Your feedback drives quality.
      </p>

      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((s) => {
          const active = (hoverRating || rating) >= s;

          return (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(s)}
              className="transition-transform active:scale-125"
              aria-label={`Rate ${s} star`}
            >
              <Star
                size={32}
                className={
                  active ? "fill-indigo-600 text-indigo-600" : "fill-slate-50 text-slate-200"
                }
              />
            </button>
          );
        })}
      </div>

      <Textarea
        placeholder="What did you think of the curriculum? (Optional)"
        className="rounded-2xl border-slate-100 dark:border-slate-800 mb-2 min-h-[120px]"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-slate-400">{comment.length}/500</span>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>

      <Button
        disabled={rating === 0}
        onClick={handleReviewSubmit}
        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl"
      >
        Submit Review
      </Button>
    </Modal>
  );
};

export default ReviewModal;
