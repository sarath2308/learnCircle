export interface IChatBotService
{
    getReply:(userMessage: string) => Promise<string>;
}