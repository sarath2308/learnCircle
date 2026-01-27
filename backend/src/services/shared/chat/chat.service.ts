import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { IChatService } from "@/interface/shared/chat/chat.service.interface";
import { IConversationRepo } from "@/interface/shared/conversation/conversation.repo.interface";
import ICourseRepo from "@/interface/shared/course/course.repo.interface";
import { IMessageRepo } from "@/interface/shared/messages/message.repo.interface";
import { IUserRepo } from "@/repos/shared/user.repo";
import {
  ConversationResponseSchema,
  ConversationResponseType,
} from "@/schema/shared/conversation/conversation.response.schema";
import {
  MessageResponseSchema,
  MessageResponseType,
} from "@/schema/shared/message.response.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.IConversationRepo) private _conversationRepo: IConversationRepo,
    @inject(TYPES.IMessageRepo) private _messageRepo: IMessageRepo,
    @inject(TYPES.ICourseRepo) private _courseRepo: ICourseRepo,
    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,
  ) {}

  async getOrCreateConversation(
    userId: string,
    courseId: string,
  ): Promise<ConversationResponseType> {
    const existing = await this._conversationRepo.findConversationForUser(courseId, userId);

    if (existing)
      return ConversationResponseSchema.parse({
        id: String(existing._id),
        courseId: String(existing.courseId),
        learnerId: String(existing.learnerId),
        instructorId: String(existing.instructorId),
      });

    const course = await this._courseRepo.findById(courseId);

    if (!course) throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);

    const instructorId = String(course.createdBy);

    if (userId === instructorId)
      throw new AppError(Messages.CONVERSATION_NOT_STARTED, HttpStatus.NOT_FOUND);
    const userObjectID = new mongoose.Types.ObjectId(userId);
    const conversation = await this._conversationRepo.create({
      courseId: course.id,
      instructorId: course.createdBy,
      learnerId: userObjectID,
    });
    const responseObject = {
      id: String(conversation._id),
      courseId: String(conversation.courseId),
      learnerId: String(conversation.learnerId),
      instructorId: String(conversation.instructorId),
    };

    return ConversationResponseSchema.parse(responseObject);
  }
  async getMessages(userId: string, conversationId: string): Promise<MessageResponseType[]> {
    let messages = await this._messageRepo.getMessagesFromConversation(conversationId);
    const responseArray = messages.map((msg) => {
      let isSender = String(msg.senderId) === userId ? true : false;
      const responseObj = {
        id: String(msg._id),
        conversationId: String(msg.conversationId),
        senderId: String(msg.senderId),
        receiverId: String(msg.receiverId),
        content: msg.content,
        createdAt: String(msg.createdAt),
        isSender: isSender,
      };
      return MessageResponseSchema.parse(responseObj);
    });

    return responseArray;
  }

  async sendMessage(senderId: string, conversationId: string, content: string): Promise<any> {
    const convo = await this._conversationRepo.findById(conversationId);
    if (!convo) throw new AppError(Messages.CONVERSATION_NOT_FOUND, HttpStatus.NOT_FOUND);

    if (senderId !== String(convo.learnerId) && senderId !== String(convo.instructorId)) {
      throw new Error("Forbidden");
    }

    const receiverId = senderId === String(convo.learnerId) ? convo.instructorId : convo.learnerId;

    const senderObjId = new mongoose.Types.ObjectId(senderId);

    const message = await this._messageRepo.create({
      senderId: senderObjId,
      receiverId,
      content: content,
      conversationId: convo._id,
    });

    const responseObj = {
      id: String(message._id),
      senderId: String(message.senderId),
      receiverId: String(message.receiverId),
      content: message.content,
      createdAt: String(message.createdAt),
      isSender: true,
    };
    return MessageResponseSchema.parse(responseObj);
  }
}
