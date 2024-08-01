import express from "express";
import {
  addBookByUser,
  deleteBookById,
  getAllBooks,
  getBookById,
  getUserBooks,
  insertDummyData,
  updateBookById,
} from "../controller/bookController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const bookRouter = express.Router();

bookRouter.get("/insert", insertDummyData);
bookRouter.get("/getallbooks", getAllBooks);
bookRouter.get("/getBookById/:id", getBookById);
bookRouter.post("/addnewbook", upload.single("file"), addBookByUser);
bookRouter.post("/getuserbooks", getUserBooks);
bookRouter.post("/delete/:id", deleteBookById);

bookRouter.put("/:id",upload.single("file"),updateBookById)
