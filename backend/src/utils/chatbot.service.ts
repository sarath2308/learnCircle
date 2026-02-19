import { STATIC_RESPONSES } from "@/cache/chat.cache";
import { openai } from "@/config/openAi/openAi.config";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { PROMPT } from "@/constants/shared/prompt";
import { AppError } from "@/errors/app.error";
import { IChatBotService } from "@/interface/shared/chatbot/chatbot.service.interface";
import { injectable } from "inversify";

@injectable()
export class ChatBotService implements IChatBotService {
  async getReply(userMessage: string): Promise<string> {
    if (STATIC_RESPONSES[userMessage]) {
      return STATIC_RESPONSES[userMessage];
    }
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `question:${userMessage}, how you should response:${PROMPT.SYSTEM_PROMPT}`,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);
      throw new AppError(Messages.CHATBOT_REPLY_NOT_FOUND, HttpStatus.NO_CONTENT);
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return reply;
  }
}
