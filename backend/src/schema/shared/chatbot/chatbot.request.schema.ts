import z from "zod";

export const ChatBotRequestSchema = z.object({
    body: z.object({
        message: z.string().trim().min(1," Message can not be empty")
    })
})