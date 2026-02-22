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
    });
    return session;
  },
};

export default sessionModel;
