import sessionModel from "../Model/sessionModel";

const sessionService = {
  async create(userId: number) {
    const session = await sessionModel.create(userId);
    return session;
  },
};

export default sessionService;
