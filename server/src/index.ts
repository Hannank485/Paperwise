import "dotenv/config";
import express from "express";
import authRouter from "./Route/authRoutes";
import fileRouter from "./Route/fileRoute";
import sessionRoute from "./Route/sessionRoute";
import authMiddleware from "./Middleware/authMiddleware";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/session", authMiddleware, sessionRoute);
app.use("/api/session/:id/file", authMiddleware, fileRouter);

app.get("/", () => console.log("Hello"));

app.listen(PORT, () => console.log("Server is up and running on ", PORT));
