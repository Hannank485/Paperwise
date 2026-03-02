import prisma from "../prismaClient";
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
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        document: true,
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
  async storeUserMessage(question: string, sessionId: number) {
    await prisma.message.create({
      data: {
        sessionId: sessionId,
        role: "user",
        content: question,
      },
    });
  },
  async storeAiMessage(response: string, sessionId: number) {
    return await prisma.message.create({
      data: {
        sessionId: sessionId,
        role: "assistant",
        content: response,
      },
    });
  },

  async getMessageHistory(sessionId: number, userId: number) {
    const messages = await prisma.session.findUnique({
      where: {
        id: sessionId,
        userId: userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
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
