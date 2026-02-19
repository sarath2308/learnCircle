import { NOTIFICATION_API } from "@/api/shared/notification.api"
import { useQuery } from "@tanstack/react-query"

export const useGetNotification = () =>
{
    return useQuery({
        queryKey:["notification"],
        queryFn: NOTIFICATION_API.GET_NOTIFICATION
    })
};