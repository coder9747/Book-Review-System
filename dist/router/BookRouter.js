"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRouter = void 0;
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controller/bookController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
exports.bookRouter = express_1.default.Router();
exports.bookRouter.get("/insert", bookController_1.insertDummyData);
exports.bookRouter.get("/getallbooks", bookController_1.getAllBooks);
exports.bookRouter.get("/getBookById/:id", bookController_1.getBookById);
exports.bookRouter.post("/addnewbook", upload.single("file"), bookController_1.addBookByUser);
exports.bookRouter.post("/getuserbooks", bookController_1.getUserBooks);
exports.bookRouter.post("/delete/:id", bookController_1.deleteBookById);
exports.bookRouter.put("/:id", upload.single("file"), bookController_1.updateBookById);
