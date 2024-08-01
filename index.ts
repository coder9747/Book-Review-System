import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./db/database";
import { authRouter } from "./router/AuthRouter";
import { bookRouter } from "./router/BookRouter";
import { reviewRouter } from "./router/reviewRouter";

const app = express();


//middleware
dotenv.config();
app.use(express.json());
app.use(cors());

// app.use("/test", (req: Request, res: Response) => res.json("Server Healthy"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/review", reviewRouter);


const port = process.env.PORT || 20000;



app.listen(port, () => {
    connectToDatabase();
    console.log(`Server Running At Port  ${port}`);
})