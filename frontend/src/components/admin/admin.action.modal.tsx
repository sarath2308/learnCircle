import { AlertCircle, ShieldAlert, CheckCircle2, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal"; // Assuming this is your base Dialog/Modal component

interface AdminActionModalProps {
  open: boolean;
  action: "block" | "reject" | "approve" | "unblock" | null;
  reason: string;
  setReason: (val: string) => void;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AdminActionModal({
  open,
  action,
  reason,
  setReason,
  loading,
  onClose,
  onConfirm,
}: AdminActionModalProps) {
  if (!action) return null;

  const needsReason = action === "block" || action === "reject";
  const trimmedReason = reason.trim();

  const isReasonValid =
    !needsReason || (trimmedReason.length >= 10 && trimmedReason.length <= 500);

  const errorMessage =
    needsReason && trimmedReason.length > 0 && trimmedReason.length < 10
      ? "Please provide at least 10 characters for the audit log."
      : needsReason && trimmedReason.length > 500
      ? "Reason is too long (max 500 characters)."
      : null;

  // Visual Configuration based on Action
  const config = {
    block: { 
      title: "Block Course", 
      icon: <ShieldAlert className="text-red-600" size={24} />, 
      color: "destructive",
      description: "This course will be hidden from all students and searches."
    },
    reject: { 
      title: "Reject Submission", 
      icon: <XCircle className="text-orange-600" size={24} />, 
      color: "destructive",
      description: "The creator will be notified and asked to make changes."
    },
    approve: { 
      title: "Approve Course", 
      icon: <CheckCircle2 className="text-green-600" size={24} />, 
      color: "default", // We'll style this as blue/green below
      description: "This will make the course live for enrollment immediately."
    },
    unblock: { 
      title: "Unblock Course", 
      icon: <Info className="text-blue-600" size={24} />, 
      color: "default",
      description: "Restores visibility and access to this course."
    },
  }[action];

  return (
    <Modal open={open} onClose={onClose} title={config.title}>
      <div className="space-y-6 pt-2">
        {/* Header/Info Section */}
        <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            {config.icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Confirm Action</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              {config.description}
            </p>
          </div>
        </div>

        {/* Form Section */}
        {needsReason && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                Reason for {action}ing
              </label>
              <span className={`text-[10px] font-bold ${trimmedReason.length > 450 ? 'text-orange-500' : 'text-slate-400'}`}>
                {trimmedReason.length}/500
              </span>
            </div>
            
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a detailed explanation for the creator..."
              className={`w-full p-4 text-sm border-2 rounded-2xl outline-none transition-all min-h-[120px] resize-none
                ${errorMessage ? 'border-red-100 focus:border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}
              `}
              maxLength={500}
            />
            
            {errorMessage ? (
              <div className="flex items-center gap-2 text-red-600 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} />
                <p className="text-xs font-bold">{errorMessage}</p>
              </div>
            ) : (
                <p className="text-[10px] text-slate-400 italic">This reason will be shared with the course instructor.</p>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex gap-3 pt-2">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!isReasonValid || loading}
            className={`flex-1 py-6 rounded-xl font-black text-sm shadow-md transition-all active:scale-95
              ${action === 'approve' || action === 'unblock' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' 
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'}
            `}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              "Confirm Selection"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}