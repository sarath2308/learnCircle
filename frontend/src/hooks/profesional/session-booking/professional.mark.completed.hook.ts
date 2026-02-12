import { PROFESSIONAL_SESSION_API } from "@/api/profesional/professional.session.booking.api"
import { useMutation, useQueryClient } from "@tanstack/react-query" // Import useQueryClient
import { AxiosError } from "axios"
import toast from "react-hot-toast"

export const useMarkSessionAsCompleted = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["mark-session-completed"],
        mutationFn: PROFESSIONAL_SESSION_API.MARK_SESSION_AS_COMPLETED,
        onSuccess: (res) => {
            // CRITICAL: Replace 'professional-sessions' with the EXACT key 
            // used in your useGetProfessionalSessions hook
            queryClient.refetchQueries({ queryKey: ["professional-sessions"] });

            
            toast.success(res.message || "Session marked as completed successfully");
        },
        onError: (err: unknown) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Failed to mark session as completed");
            }
        }
    });
}