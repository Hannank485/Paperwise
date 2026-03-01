import express from "express";
import sessionController from "../Controller/sessionController";

const router = express.Router({ mergeParams: true });

// router.post("/create", sessionController.create);
router.get("/", sessionController.getAllSessions);
router.get("/:id", sessionController.getSingleSession);
router.post("/:id/message", sessionController.messageQuestion);
router.post("/:id/delete", sessionController.delete);
export default router;
