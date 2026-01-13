// components/AdminActionModal.tsx
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/Modal"

interface AdminActionModalProps {
  open: boolean
  action: "block" | "reject" | "approve" | "unblock" | null
  reason: string
  setReason: (val: string) => void
  loading: boolean
  onClose: () => void
  onConfirm: () => void
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
  if (!action) return null

  const needsReason = action === "block" || action === "reject"
  const trimmedReason = reason.trim()

  const isReasonValid =
    !needsReason ||
    (trimmedReason.length >= 10 && trimmedReason.length <= 500)

  const errorMessage =
    needsReason && trimmedReason.length > 0 && trimmedReason.length < 10
      ? "Reason must be at least 10 characters"
      : needsReason && trimmedReason.length > 500
      ? "Reason cannot exceed 500 characters"
      : null

  const titleMap = {
    block: "Block Course",
    reject: "Reject Course",
    approve: "Approve Course",
    unblock: "Unblock Course",
  }

  return (
    <Modal open={open} onClose={onClose} title={titleMap[action]}>
      <div className="space-y-4">
        {needsReason && (
          <>
            <label className="text-sm font-medium">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={4}
              maxLength={500}
            />
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {trimmedReason.length}/500 characters
            </p>
          </>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
          className="bg-yellow-600"
            variant={
              action === "approve" || action === "unblock"
                ? "default"
                : "destructive"
            }
            onClick={onConfirm}
            disabled={!isReasonValid || loading}
          >
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
