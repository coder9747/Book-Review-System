import express from "express";
import { addReview, getReview } from "../controller/reviewController";

export const reviewRouter = express.Router();

reviewRouter.post("/addreview",addReview);
reviewRouter.post("/getreview",getReview);