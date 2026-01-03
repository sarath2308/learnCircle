/* eslint-disable no-undef */
import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock background scroll when open
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  // Esc key handler
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Focus the modal content on open (basic, not full trap)
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
        tabIndex={-1}  // Make it focusable for initial focus
        onClick={(e) => e.stopPropagation()}
      >
       {/* Header - always shown for close button */}
<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
  {title ? (
    <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
      {title}
    </h2>
  ) : (
    // Optional: invisible spacer so close button stays right-aligned
    <div className="w-0 h-0" />
  )}
  <button
    onClick={onClose}
    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    aria-label="Close modal"
  >
    {/* SVG */}
  </button>
</div>

    {/* Body - scrollable if content is long */}
        <div className="px-6 py-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}