"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controller/reviewController");
exports.reviewRouter = express_1.default.Router();
exports.reviewRouter.post("/addreview", reviewController_1.addReview);
exports.reviewRouter.post("/getreview", reviewController_1.getReview);
