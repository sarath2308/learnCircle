import { STATIC_RESPONSES } from "@/cache/chat.cache";
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

    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash-lite";
    const apiKey = process.env.GEMINI_API_KEY;

    // Fix 1: Correct URL path with /models/
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Fix 2: Proper System Instruction (Optional but recommended)
        system_instruction: {
          parts: [{ text: PROMPT.SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Fix 3: Log the actual error from Google so you can stop guessing
      console.error("Gemini API Error Detail:", data.error?.message || data);
      throw new AppError(
        data.error?.message || Messages.CHATBOT_REPLY_NOT_FOUND, 
        response.status
      );
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    

    if (!reply) {
      throw new AppError("Empty response from AI", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return reply;
  }
}