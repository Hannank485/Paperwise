import express from "express";
import authController from "../Controller/authController";
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authController.CheckAuth);
router.post("/logout", authController.logout);
export default router;
