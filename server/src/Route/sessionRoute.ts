import express from "express";
import sessionController from "../Controller/sessionController";

const router = express.Router();

router.post("/create", sessionController.create);
export default router;
