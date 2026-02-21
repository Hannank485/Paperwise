import prisma from "../prismaClient";
const authModel = {
  async findUser(username: string) {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  },

  async register(username: string, password: string) {
    return await prisma.user.createManyAndReturn({
      data: {
        username: username,
        password: password,
      },
    });
  },
};

export default authModel;
