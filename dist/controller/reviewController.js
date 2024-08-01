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
exports.getReview = exports.addReview = void 0;
const Helper_1 = require("../Helper");
const ReviewModel_1 = __importDefault(require("../Models/ReviewModel"));
const ReviewModel_2 = __importDefault(require("../Models/ReviewModel"));
const reviewPerPage = 5;
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId, userId, comment, email } = req.body;
    if (!bookId || !userId || !comment || !email) {
        return res.json((0, Helper_1.generateResponeType)(false, 'Insufficent Data', null));
    }
    try {
        const newReview = new ReviewModel_1.default({ bookId, userId, comment, email });
        yield newReview.save();
        return res.json((0, Helper_1.generateResponeType)(true, "Review Added Succesful", null));
    }
    catch (error) {
        return res.json((0, Helper_1.generateResponeType)(false, "Internal Server Error", null));
    }
});
exports.addReview = addReview;
const getReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, bookId } = req.body;
    console.log(page, bookId);
    if (!page || !bookId) {
        return res.json((0, Helper_1.generateResponeType)(false, 'Data Requred', null));
    }
    ;
    try {
        const reviewsArray = yield ReviewModel_2.default.find({
            bookId,
        }).skip((Number(page) - 1) * reviewPerPage).limit(reviewPerPage).sort({ createdAt: -1 });
        if (reviewsArray.length == 0) {
            return res.json((0, Helper_1.generateResponeType)(true, 'No More Data', { hasMore: false, reviewsArray: [] }));
        }
        return res.json((0, Helper_1.generateResponeType)(true, 'Data Fetched Succesful', { hasMore: true, reviewsArray }));
    }
    catch (error) {
        return res.json((0, Helper_1.generateResponeType)(false, "Internal Server Error", null));
    }
});
exports.getReview = getReview;
