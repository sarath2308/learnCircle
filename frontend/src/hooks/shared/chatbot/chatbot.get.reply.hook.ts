import { CHATBOT_API } from "@/api/shared/chatbot.api";
import { useMutation } from "@tanstack/react-query";

export const useGetChatbotReply = () => {
  return useMutation({
    mutationFn: CHATBOT_API.getMessage,
  });
};
