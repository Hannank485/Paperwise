import type { Request, Response } from "express";
import fileService from "../Service/fileService";
interface AuthRequest extends Request {
  userId?: number;
}

const fileController = {
  async upload(req: AuthRequest, res: Response) {
    console.log(req.params.id);

    const userId = req.userId;
    const file = req.file;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized to create session" });
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

export default fileController;
