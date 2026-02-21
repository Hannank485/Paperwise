import express from "express";
import fileController from "../Controller/fileController";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post("/upload", upload.single("pdf"), fileController.upload);

export default router;
