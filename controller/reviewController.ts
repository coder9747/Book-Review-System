import { Request, Response } from "express"
import { generateResponeType } from "../Helper";
import Review from "../Models/ReviewModel";
import ReviewModal from "../Models/ReviewModel";

const reviewPerPage = 5;


export const addReview = async (req: Request, res: Response) => {

    const { bookId, userId, comment, email } = req.body;
    if (!bookId || !userId || !comment || !email) {
        return res.json(generateResponeType(false, 'Insufficent Data', null));
    }
    try {
        const newReview = new Review({ bookId, userId, comment, email });
        await newReview.save();
        return res.json(generateResponeType(true, "Review Added Succesful", null));

    } catch (error) {
        return res.json(generateResponeType(false, "Internal Server Error", null));

    }

}
export const getReview = async (req: Request, res: Response) => {
    const { page, bookId } = req.body;
    console.log(page,bookId);
    if (!page || !bookId) {
        return res.json(generateResponeType(false, 'Data Requred', null));
    };
    try {
        const reviewsArray = await ReviewModal.find({
            bookId,
        }).skip((Number(page) - 1) * reviewPerPage).limit(reviewPerPage).sort({createdAt:-1})
        if (reviewsArray.length == 0) {
            return res.json(generateResponeType(true, 'No More Data', { hasMore: false, reviewsArray: [] }));
        }
        return res.json(generateResponeType(true, 'Data Fetched Succesful', { hasMore: true, reviewsArray }));

    } catch (error) {
        return res.json(generateResponeType(false, "Internal Server Error", null));
    }

}