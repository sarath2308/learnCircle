import React, { useEffect } from "react";
import { Button } from "./ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, children }) => {
  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 rounded-9xl"
      onClick={onClose} // clicking backdrop closes modal
    >
      <div
        className="bg-white p-4 rounded shadow-lg min-w-[300px]"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {children}
        <Button className="bg-green-600 m-2" onClick={onSave}>
          Save
        </Button>
        <Button className="bg-yellow-600 m-2" onClick={onClose}>
          close
        </Button>
      </div>
    </div>
  );
};

export default Modal;
