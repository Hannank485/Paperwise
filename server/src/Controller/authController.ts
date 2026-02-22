import type { Request, Response } from "express";
import authService from "../Service/authService.js";

const authController = {
  async register(req: Request, res: Response) {
    const { username, password }: { username: string; password: string } =
      req.body;

    // DATA CHECK AND SETTING USERNAME TO LOWER CASE
    if (!username || !password) {
      return res.status(400).json({ message: "Credentials not sent" });
    }
    const usernameLower = username.toLowerCase();
    if (password.length < 8 || password.length > 15) {
      return res
        .status(400)
        .json({ message: "Credential requirement not met" });
    }

    // REGISTER PROCESS
    try {
      await authService.register(usernameLower, password);
      return res.status(201).json({ message: "Registration Successful" });
    } catch (err) {
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
    }
  },

  async login(req: Request, res: Response) {
    // DATA CHECK AND SETTING USERNAME TO LOWER CASE
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Credentials not sent" });
    }
    const usernameLower = username.toLowerCase();
    try {
      const accessToken = await authService.login(usernameLower, password);
      res.cookie("accessToken", accessToken, {
        secure: true,
        sameSite: "strict",
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
      return res.status(200).json({ message: accessToken });
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

export default authController;
