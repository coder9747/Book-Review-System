"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookById = exports.deleteBookById = exports.getUserBooks = exports.addBookByUser = exports.getBookById = exports.getAllBooks = exports.insertDummyData = void 0;
const BookModel_1 = __importDefault(require("../Models/BookModel"));
const dummyBookData_1 = __importDefault(require("../dummyBookData"));
const Helper_1 = require("../Helper");
const s3Service_1 = require("../service/s3Service");
const squareData = [
    {
        id: 1,
        src: "https://storage.googleapis.com/lr-assets/main/covers/1709044808-619rxhfo0ul._sl1500_-131x200.jpg",
    },
    {
        id: 2,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/400/9781529433470.jpg",
    },
    {
        id: 3,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/400/9781446313176.jpg",
    },
    {
        id: 4,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/200/9781529424676.jpg",
    },
    {
        id: 5,
        src: "https://storage.googleapis.com/lr-assets/main/covers/1716477207-9781526617613-130x200.jpg",
    },
    {
        id: 6,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/200/9781035908639.jpg",
    },
    {
        id: 7,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/200/9781399604741.jpg",
    },
    {
        id: 8,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/200/9780008625825.jpg",
    },
    {
        id: 9,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/200/9781446313176.jpg",
    },
    {
        id: 10,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/200/9781529038026.jpg",
    },
    {
        id: 11,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/200/9781399401586.jpg",
    },
    {
        id: 12,
        src: "https://storage.googleapis.com/lr-assets/main/covers/1718785473-9780349436470-131x200.jpg",
    },
    {
        id: 13,
        src: "https://storage.googleapis.com/lr-assets/main/covers/1718800545-61qfxkvv8rl._sl1500_-130x200.jpg",
    },
    {
        id: 14,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/200/9781837994014.jpg",
    },
    {
        id: 15,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/200/9781035900251.jpg",
    },
    {
        id: 16,
        src: "https://storage.googleapis.com/lr-assets/_nielsen/200/9781399725255.jpg",
    },
];
const booksPerPage = 12;
const insertDummyData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let idx = 0;
    for (const data of dummyBookData_1.default) {
        const newBook = new BookModel_1.default({
            title: data.title,
            author: data.author,
            description: data.description,
            publishedDate: data.publishedDate,
            genre: data.genre,
            rating: data.rating,
            coverImageUrl: squareData[idx].src,
        });
        idx++;
        if (idx == squareData.length)
            idx = 0;
        try {
            yield newBook.save();
            console.log("book Saved Succesful");
        }
        catch (error) {
            console.log(error);
            console.log("failed to save book");
        }
    }
    return res.json({ succes: true });
});
exports.insertDummyData = insertDummyData;
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page || 1;
        const allBooks = yield BookModel_1.default.find({})
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * booksPerPage)
            .limit(booksPerPage);
        if (allBooks.length == 0) {
            return res.json((0, Helper_1.generateResponeType)(true, `Data At Page ${page}`, {
                allBooks,
                hasMore: false,
            }));
        }
        return res.json((0, Helper_1.generateResponeType)(true, `Data At Page ${page}`, {
            allBooks,
            hasMore: true,
        }));
    }
    catch (error) {
        console.log(error);
        return res.json((0, Helper_1.generateResponeType)(false, "Internal Server Error", null));
    }
});
exports.getAllBooks = getAllBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.json((0, Helper_1.generateResponeType)(false, "Id Is Required", null));
    }
    try {
        const bookData = yield BookModel_1.default.findById(id);
        if (!bookData) {
            return res.json((0, Helper_1.generateResponeType)(false, `${id} is Invalid`, null));
        }
        return res.json((0, Helper_1.generateResponeType)(true, "Data Fetched Succesful", bookData));
    }
    catch (error) {
        return res.json((0, Helper_1.generateResponeType)(false, "Internal Server Error", null));
    }
});
exports.getBookById = getBookById;
const addBookByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { title, description, author, genre, userId } = req.body;
    if (!title || !description || !author || !genre || !file || !userId) {
        return res.json((0, Helper_1.generateResponeType)(false, "Data Required", null));
    }
    try {
        const uploadResult = yield (0, s3Service_1.uploadToS3)(file);
        const newBook = new BookModel_1.default({
            author,
            title,
            description,
            coverImageUrl: uploadResult.Location,
            genre: genre.split(","),
            uploaderUserId: userId,
            publishedDate: new Date(),
        });
        yield newBook.save();
        return res.json((0, Helper_1.generateResponeType)(true, "Book Uploaded Succesful", null));
    }
    catch (error) {
        console.log(error);
        return res.json((0, Helper_1.generateResponeType)(false, "Internal Server Error", null));
    }
});
exports.addBookByUser = addBookByUser;
const getUserBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.json((0, Helper_1.generateResponeType)(false, "id Required", null));
    }
    try {
        const userBooks = yield BookModel_1.default.find({ uploaderUserId: userId });
        return res.json((0, Helper_1.generateResponeType)(true, "Book Fetched Succesful", userBooks));
    }
    catch (error) {
        return res.json((0, Helper_1.generateResponeType)(false, "Internal Server Error", null));
    }
});
exports.getUserBooks = getUserBooks;
const deleteBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.json((0, Helper_1.generateResponeType)(false, "BookId Required", null));
    }
    try {
        yield BookModel_1.default.findByIdAndDelete(id);
        return res.json((0, Helper_1.generateResponeType)(true, "Book Deleted Succesful", null));
    }
    catch (error) {
        return res.json((0, Helper_1.generateResponeType)(false, "Internal Server Error", null));
    }
});
exports.deleteBookById = deleteBookById;
// export const updateBookById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const file = req.file;
//   const { title, description, author, genre, userId } = req.body;
//   if (!title || !description || !author || !genre || !userId || !id) {
//     return res.json(generateResponeType(false, "Data Required", null));
//   }
//   //checking userId == book.uploaderId
//   try {
//     const book = await BookModal.findById(id);
//     if (book.uploaderUserId != userId) {
//       return res.json(generateResponeType(false, "Invalid Update", null));
//     }
//     if (file) {
//       const uploadResult = await uploadToS3(file);
//       await BookModal.findByIdAndUpdate({
//         author,
//         title,
//         description,
//         coverImageUrl: uploadResult.Location,
//         genre: genre.split(","),
//       });
//     } else {
//       console.log(author,title,description,genre);
//       await BookModal.findByIdAndUpdate({
//         author,
//         title,
//         description,
//         genre: genre.split(","),
//       });
//     }
//     return res.json(generateResponeType(true, "Book Updated Succesful", null));
//   } catch (error) {
//     console.log(error);
//     return res.json(generateResponeType(false, "Internal Server Error", null));
//   }
// };
const updateBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const file = req.file;
    const { title, description, author, genre, userId } = req.body;
    if (!title || !description || !author || !genre || !userId || !id) {
        return res.json((0, Helper_1.generateResponeType)(false, "Data Required", null));
    }
    try {
        const book = yield BookModel_1.default.findById(id);
        if (!book) {
            return res.json((0, Helper_1.generateResponeType)(false, "Book Not Found", null));
        }
        if (book.uploaderUserId != userId) {
            return res.json((0, Helper_1.generateResponeType)(false, "Invalid Update", null));
        }
        const updateData = {
            author,
            title,
            description,
            genre: genre.split(","),
        };
        if (file) {
            const uploadResult = yield (0, s3Service_1.uploadToS3)(file);
            updateData.coverImageUrl = uploadResult.Location;
        }
        yield BookModel_1.default.findByIdAndUpdate(id, updateData);
        return res.json((0, Helper_1.generateResponeType)(true, "Book Updated Successfully", null));
    }
    catch (error) {
        return res.json((0, Helper_1.generateResponeType)(false, "Internal Server Error", null));
    }
});
exports.updateBookById = updateBookById;
