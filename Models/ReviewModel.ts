import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    bookId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    comment: string;
    rating: number;
    createdAt: Date;
    email: string,
}

const reviewSchema = new Schema<IReview>({
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ReviewModal = mongoose.model<IReview>('Review', reviewSchema);

export default ReviewModal;
