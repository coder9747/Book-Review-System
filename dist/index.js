"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./db/database");
const AuthRouter_1 = require("./router/AuthRouter");
const BookRouter_1 = require("./router/BookRouter");
const reviewRouter_1 = require("./router/reviewRouter");
const app = (0, express_1.default)();
//middleware
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// app.use("/test", (req: Request, res: Response) => res.json("Server Healthy"));
app.use("/api/v1/auth", AuthRouter_1.authRouter);
app.use("/api/v1/books", BookRouter_1.bookRouter);
app.use("/api/v1/review", reviewRouter_1.reviewRouter);
const port = process.env.PORT || 20000;
app.listen(port, () => {
    (0, database_1.connectToDatabase)();
    console.log(`Server Running At Port  ${port}`);
});
