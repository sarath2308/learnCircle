import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { IChatService } from "@/interface/shared/chat/chat.service.interface";
import { IConversationParticipantRepo } from "@/interface/shared/conversation/conversation.participant.interface";
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
} from "@/schema/shared/message/message.response.schema";
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
    @inject(TYPES.IConversationParticipantRepo)
    private _conversationParticipantRepo: IConversationParticipantRepo,
  ) {}

  async getOrCreateConversation(
    userId: string,
    courseId: string,
  ): Promise<ConversationResponseType> {
    const existing = await this._conversationRepo.findConversationForUser(courseId, userId);
    let conversationParticipant = null;
    let unreadCount = null;
    let lastreadAt = null;

    if (existing) {
      conversationParticipant = await this._conversationParticipantRepo.updateLastRead(
        userId,
        String(existing._id),
      );
      lastreadAt = conversationParticipant?.lastReadAt;
      unreadCount = await this._messageRepo.countUnreadMessage(
        String(existing._id),
        userId,
        lastreadAt ?? new Date(),
      );
      return ConversationResponseSchema.parse({
        id: String(existing._id),
        courseId: String(existing.courseId),
        learnerId: String(existing.learnerId),
        instructorId: String(existing.instructorId),
        unreadCount,
      });
    }

    const course = await this._courseRepo.findCourseWithOutPoppulate(courseId);

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
    conversationParticipant = await this._conversationParticipantRepo.updateLastRead(
      userId,
      String(conversation._id),
    );
    lastreadAt = conversationParticipant?.lastReadAt;
    unreadCount = await this._messageRepo.countUnreadMessage(
      String(conversation._id),
      userId,
      lastreadAt ?? new Date(),
    );
    const responseObject = {
      id: String(conversation._id),
      courseId: String(conversation.courseId),
      learnerId: String(conversation.learnerId),
      instructorId: String(conversation.instructorId),
      unreadCount,
    };

    return ConversationResponseSchema.parse(responseObject);
  }
  async getMessages(userId: string, conversationId: string): Promise<MessageResponseType[]> {
    let messages = await this._messageRepo.getMessagesFromConversation(conversationId);
    const responseArray = messages.map((msg) => {
      const responseObj = {
        id: String(msg._id),
        conversationId: String(msg.conversationId),
        senderId: String(msg.senderId),
        receiverId: String(msg.receiverId),
        content: msg.content,
        createdAt: String(msg.createdAt),
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
      conversationId: String(message.conversationId),
      receiverId: String(message.receiverId),
      content: message.content,
      createdAt: String(message.createdAt),
    };
    return MessageResponseSchema.parse(responseObj);
  }

  async getAllConversation(userId: string): Promise<ConversationResponseType[]> {
    const conversations = await this._conversationRepo.findAllConversationForUser(userId);

    const responseArray = await Promise.all(
      conversations.map(async (conv) => {
        const participant = await this._conversationParticipantRepo.findByUserAndConversation(
          userId,
          String(conv._id),
        );
        let courseData = await this._courseRepo.findById(String(conv.courseId));
        const lastReadAt = participant?.lastReadAt ?? new Date(0);

        const unreadCount = await this._messageRepo.countUnreadMessage(
          String(conv._id),
          userId,
          lastReadAt,
        );

        return {
          id: String(conv._id),
          courseId: String(conv.courseId),
          learnerId: String(conv.learnerId),
          instructorId: String(conv.instructorId),
          courseName: courseData?.title ?? "",
          unreadCount,
        };
      }),
    );

    return responseArray;
  }
}
