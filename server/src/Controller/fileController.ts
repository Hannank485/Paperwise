import type { Request, Response } from "express";
import fileService from "../Service/fileService";
import { AppError } from "../app";

interface AuthRequest extends Request {
  userId?: number;
}

const fileController = {
  async upload(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const file = req.file;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!file) {
      return res.status(400).json({ message: "File not sent" });
    }
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Invalid File Type" });
    }
    try {
      const result = await fileService.upload(file, userId);
      return res.status(201).json(result);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.status).json({
          message: err.message,
        });
      }
    }
  },
};

export default fileController;
