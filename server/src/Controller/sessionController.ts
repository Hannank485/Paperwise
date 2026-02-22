import type { Request, Response } from "express";
import sessionService from "../Service/sessionService";
interface AuthRequest extends Request {
  userId?: number;
}

const sessionController = {
  // CREATE SESSION
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
      if (err instanceof Error) {
        return res.status(400).json({
          message: err.message,
        });
      }

      return res.status(500).json({
        message: "Unknown error",
      });
    }
  },

  // DELETE SESSION
  async delete(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const sessionId = Number(req.params.id);
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized to create session" });
    }
    if (!sessionId) {
      return res.status(400).json({
        message: "Invalid session id",
      });
    }
    try {
      const result = await sessionService.delete(userId, sessionId);
      if (!result) {
        return res.status(500).json({ message: "Delete Failed" });
      }
      return res.status(200).json({ message: "Delete Successfully" });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({
          message: err.message,
        });
      }
      return res.status(500).json({
        message: "Unknown error",
      });
    }
  },
  // MESSAGE QUESTIONS
  async messageQuestion(req: AuthRequest, res: Response) {
    const { user } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized to create session" });
    }
    if (!user) {
      return res.status(400).json({ message: "Message data insufficicent" });
    }
    const sessionId = Number(req.params.id);
    if (!sessionId) {
      return res.status(400).json({ message: "Invalid Session ID" });
    }

    try {
      const response = await sessionService.messageQuestion(
        user,
        sessionId,
        userId,
      );
      //  return res.status(201).json({ message: response?.choices[0].message.content });
      return res.status(201).json({ message: response });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({
          message: err.message,
        });
      }
      return res.status(500).json({
        message: "Unknown error",
      });
    }
  },
  async getAllSessions(req: AuthRequest, res: Response) {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized to create session" });
    }
    try {
      await sessionService.getAllSessions(userId);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({
          message: err.message,
        });
      }
      return res.status(500).json({
        message: "Unknown error",
      });
    }
  },
};

export default sessionController;
