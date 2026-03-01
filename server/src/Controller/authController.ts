import type { Request, Response } from "express";
import authService from "../Service/authService.js";
import { AppError } from "../app.js";

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
        .json({ message: "Password should be 8-15 characters" });
    }

    // REGISTER PROCESS
    try {
      await authService.register(usernameLower, password);
      return res.status(201).json({ message: "Registration Successful" });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.status).json({
          message: err.message,
        });
      }
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
        secure: false,
        sameSite: "lax",
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
      return res.status(200).json({ message: "Logged In" });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.status).json({
          message: err.message,
        });
      }
    }
  },
  async CheckAuth(req: Request, res: Response) {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isValid = await authService.checkAuth(accessToken);
    if (isValid) {
      return res.status(200).json({ message: "authorised", user: isValid });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  },
  async logout(req: Request, res: Response) {
    res.clearCookie("accessToken");
    res.status(200).json({ message: "logged out" });
  },
};

export default authController;
