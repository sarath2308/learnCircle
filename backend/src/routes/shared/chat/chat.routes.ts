import { IChatController } from "@/interface/shared/chat/chat.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { GetConversationSchema } from "@/schema/shared/conversation/conversation.request.params.schema";
import { GetMessageSchema } from "@/schema/shared/message/message.request.params.schema";
import { Router } from "express";

export function chatRoutes(controller: IChatController) {
  const router = Router();
  router.get("/conversation", controller.getAllConversation.bind(controller));
  router.get(
    "/conversation/:courseId",
    validateRequest(GetConversationSchema),
    controller.getOrCreateConversation.bind(controller),
  );
  router.get(
    "/conversation/messages/:conversationId",
    validateRequest(GetMessageSchema),
    controller.getMessages.bind(controller),
  );

  return router;
}
