import express from "express";
import authRouter from "./Route/authRoutes";
import fileRouter from "./Route/fileRoute";
import sessionRoute from "./Route/sessionRoute";
import authMiddleware from "./Middleware/authMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

export class AppError extends Error {
  status: number;
  constructor(message: string, status: number) {
    (super(message), (this.status = status));
  }
}

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://192.168.1.73:5173",
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api/sessions", authMiddleware, sessionRoute);
app.use("/api/documents", authMiddleware, fileRouter);

export default app;
