import prisma from "../prismaClient";
import { Role } from "@prisma/client";
const sessionModel = {
  async create(userId: number) {
    const session = await prisma.session.create({
      data: {
        userId: userId,
      },
    });
    return session;
  },
  async getSingleSession(sessionId: number) {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    return session;
  },

  async deleteSession(sessionId: number, userId: number) {
    const result = await prisma.session.update({
      data: {
        isActive: false,
      },
      where: {
        id: sessionId,
        userId: userId,
      },
    });
    return result;
  },
  async message(user: string, assistant: string, sessionId: number) {
    await prisma.$transaction(async (tx) => {
      await tx.message.create({
        data: {
          sessionId: sessionId,
          role: Role.user,
          content: user,
        },
      });
      await tx.message.create({
        data: {
          sessionId: sessionId,
          role: Role.assistant,
          content: assistant,
        },
      });
    });
  },

  async getMessageHistory(sessionId: number) {
    const messages = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 4,
        },
      },
    });
    return messages;
  },
  async getAllSessions(userId: number) {
    const sessions = await prisma.session.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      include: {
        messages: true,
        document: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return sessions;
  },
};

export default sessionModel;
