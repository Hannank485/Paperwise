import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authModel from "../Model/authModel";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const authService = {
  async register(username: string, password: string) {
    const userExist = await authModel.findUser(username);
    if (userExist) {
      throw new Error("User Already Exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await authModel.register(username, hashedPassword);
    if (!result) {
      throw new Error("User not Registered");
    }
  },
  async login(username: string, password: string) {
    const user = await authModel.findUser(username);
    if (!user) {
      throw new Error("User Does not Exist or Password is invalid");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("User Does not Exist or Password is invalid");
    }
    if (!ACCESS_TOKEN) {
      throw new Error("ACCESS TOKEN NOT SET");
    }
    const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN, {
      expiresIn: "1h",
    });
    return accessToken;
  },
};

export default authService;
