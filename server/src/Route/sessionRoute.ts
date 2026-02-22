import express from "express";
import sessionController from "../Controller/sessionController";

const router = express.Router({ mergeParams: true });

router.post("/create", sessionController.create);
router.get("/get", sessionController.getAllSessions);
router.post("/:id/delete", sessionController.delete);
router.post("/:id/message/question", sessionController.messageQuestion);
export default router;
