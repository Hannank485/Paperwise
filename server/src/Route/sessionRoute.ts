import express from "express";
import sessionController from "../Controller/sessionController";

const router = express.Router({ mergeParams: true });

// router.post("/create", sessionController.create);
router.get("/getAll", sessionController.getAllSessions);
(router.get("/get/:id", sessionController.getSingleSession),
  router.post("/:id/delete", sessionController.delete));
router.post("/:id/message", sessionController.messageQuestion);
export default router;
