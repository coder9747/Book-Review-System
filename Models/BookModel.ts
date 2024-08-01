import mongoose, { Document, Schema } from "mongoose";
import books from "../dummyBookData";

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  publishedDate: Date;
  genre: string[];
  rating: number;
  reviews: mongoose.Types.ObjectId[];
  coverImageUrl?: string;
  uploaderUserId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: true,
  },
  uploaderUserId: {
    type: mongoose.Schema.ObjectId,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  coverImageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BookModal = mongoose.model<IBook>("Book", bookSchema);

export default BookModal;
