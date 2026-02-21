import type { Request, Response } from "express";
import fileService from "../Service/fileService";

const fileController = {
  async upload(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "File not sent" });
    }
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Invalid File Type" });
    }
    const result = await fileService.upload(file);
  },
};

export default fileController;
