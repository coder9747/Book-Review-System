import express from "express";
import { loginUser, registerUser } from "../controller/authController";

export const authRouter = express.Router();

authRouter.post("/register",registerUser);
authRouter.post("/login",loginUser);

