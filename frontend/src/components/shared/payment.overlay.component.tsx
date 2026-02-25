"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";

export enum PaymentStatus {
  IDLE = "IDLE",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

interface PaymentStatusOverlayProps {
  status: PaymentStatus;
  onClose: () => void;
  successMessage?: string;
  errorMessage?: string;
}

export const PaymentStatusOverlay = ({
  status,
  onClose,
  successMessage = "Payment confirmed. Your elite Experience starts now.",
  errorMessage = "Something went wrong with the transaction or verification.",
}: PaymentStatusOverlayProps) => {
  if (status === "IDLE") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 dark:bg-[#0b0b0f]/95 backdrop-blur-md"
      >
        <div className="text-center max-w-xs w-full p-8">
          {status === "PROCESSING" && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Loader2 size={60} className="text-indigo-600 animate-spin" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Verifying Payment</h2>
              <p className="text-sm text-slate-500 font-bold leading-relaxed">
                Don't refresh. Securely confirming your enrollment...
              </p>
            </div>
          )}

          {status === "SUCCESS" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={40} className="text-white" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Access Granted</h2>
              <p className="text-sm text-slate-500 font-bold">{successMessage}</p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 dark:bg-white dark:text-black text-white font-black text-xs uppercase tracking-widest rounded-lg hover:scale-[1.02] transition-transform"
              >
                Start Learning
              </button>
            </motion.div>
          )}

          {status === "FAILED" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={40} className="text-white" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Payment Failed</h2>
              <p className="text-sm text-slate-500 font-bold">{errorMessage}</p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-lg"
              >
                Go Back
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
