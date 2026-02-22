import { NOTIFICATION_API } from "@/api/shared/notification.api";
import { useMutation } from "@tanstack/react-query";

export const useNotificationMarkAsRead = () => {
  return useMutation({
    mutationFn: NOTIFICATION_API.MARK_AS_READ,
  });
};
