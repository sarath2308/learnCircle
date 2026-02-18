import { IChatBotController } from "@/interface/shared/chatbot/chatbot.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { ChatBotRequestSchema } from "@/schema/shared/chatbot/chatbot.request.schema";
import { Router } from "express";

export const ChatBotRoutes = (controller: IChatBotController) =>
{
    const router = Router();

    router.post("/", validateRequest(ChatBotRequestSchema), controller.getReply.bind(controller));

    return router;
}