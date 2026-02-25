import "dotenv/config";
import express from "express";
import authRouter from "./Route/authRoutes";
import fileRouter from "./Route/fileRoute";
import sessionRoute from "./Route/sessionRoute";
import authMiddleware from "./Middleware/authMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api/session", authMiddleware, sessionRoute);
app.use("/api/session/:id", authMiddleware, fileRouter);

app.get("/", () => console.log("Hello"));

app.listen(PORT, () => console.log("Server is up and running on ", PORT));
