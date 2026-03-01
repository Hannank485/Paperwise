import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authModel from "../Model/authModel";
import { AppError } from "../app";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const authService = {
  async register(username: string, password: string) {
    const userExist = await authModel.findUser(username);
    if (userExist) {
      throw new AppError("Username Already Exists", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await authModel.register(username, hashedPassword);
    if (!result) {
      throw new AppError("Username not Registered", 500);
    }
  },
  async login(username: string, password: string) {
    const user = await authModel.findUser(username);
    if (!user) {
      throw new AppError("Invalid Username or Password", 401);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid Username or Password", 401);
    }
    if (!ACCESS_TOKEN) {
      throw new AppError("ACCESS TOKEN NOT SET", 500);
    }
    const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN, {
      expiresIn: "1h",
    });
    return accessToken;
  },
  async checkAuth(accessToken: string) {
    if (!ACCESS_TOKEN) {
      throw new AppError("ACCESS TOKEN NOT SET", 500);
    }
    const isValid = jwt.verify(accessToken, ACCESS_TOKEN);
    return isValid;
  },
};

export default authService;
