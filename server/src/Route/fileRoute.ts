import express from "express";
import fileController from "../Controller/fileController";
import multer from "multer";

const upload = multer();
const router = express.Router({ mergeParams: true });

router.post(
  "/upload",
  (req, res, next) => {
    console.log(req.params);
    next();
  },
  upload.single("pdf"),
  fileController.upload,
);

export default router;
