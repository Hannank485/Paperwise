import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authModel from "../Model/authModel";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const authService = {
  async register(username: string, password: string) {
    const userExist = await authModel.findUser(username);
    if (userExist) {
      throw new Error("Username Already Exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await authModel.register(username, hashedPassword);
    if (!result) {
      throw new Error("Username not Registered");
    }
  },
  async login(username: string, password: string) {
    const user = await authModel.findUser(username);
    if (!user) {
      throw new Error("Invalid Username or Password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Username or Password");
    }
    if (!ACCESS_TOKEN) {
      throw new Error("ACCESS TOKEN NOT SET");
    }
    const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN, {
      expiresIn: "1h",
    });
    return accessToken;
  },
  async checkAuth(accessToken: string) {
    if (!ACCESS_TOKEN) {
      throw new Error("ACCESS TOKEN NOT SET");
    }
    const isValid = jwt.verify(accessToken, ACCESS_TOKEN);
    return isValid;
  },
};

export default authService;
