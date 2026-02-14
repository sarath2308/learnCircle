import { CHAT_API } from "@/api/shared/chat.api";
import { useQuery } from "@tanstack/react-query";

export const useGetAllConversation = () => {
  return useQuery({
    queryKey: ["get-all-conversation"],
    queryFn: CHAT_API.getAllConversation,
  });
};
