import { SHARED_SESSION_BOOKING_API } from "@/api/shared/session.shared.api"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import toast from "react-hot-toast"

export const useCheckSessionJoinPermission = ()=>
{
    return useMutation({
        mutationKey: ["check-session-join-permission"],
        mutationFn: SHARED_SESSION_BOOKING_API.CHECK_JOIN_PERMISSION,
        onError: (error: unknown) => {
            if(error instanceof AxiosError)
            {
                const message = error.response?.data?.message || "An error occurred while checking join permission.";
                console.error(message);
                toast.error(message);
            }
        }
    })
}