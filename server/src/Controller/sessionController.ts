import type { Request, Response } from "express";
import sessionService from "../Service/sessionService";
interface AuthRequest extends Request {
  userId?: number;
}

const sessionController = {
  async create(req: AuthRequest, res: Response) {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized to create session" });
    }
    try {
      const session = await sessionService.create(userId);
      return res.status(200).json({ message: session.id });
    } catch (err) {
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
    }
  },
};

export default sessionController;
