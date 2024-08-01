import { Request, Response } from "express";
import BookModal from "../Models/BookModel";
import books from "../dummyBookData";
import { generateResponeType } from "../Helper";
import { uploadToS3 } from "../service/s3Service";
import { TemporaryCredentials } from "aws-sdk";
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

export const insertDummyData = async (req: Request, res: Response) => {
  let idx = 0;
  for (const data of books) {
    const newBook = new BookModal({
      title: data.title,
      author: data.author,
      description: data.description,
      publishedDate: data.publishedDate,
      genre: data.genre,
      rating: data.rating,
      coverImageUrl: squareData[idx].src,
    });
    idx++;
    if (idx == squareData.length) idx = 0;
    try {
      await newBook.save();
      console.log("book Saved Succesful");
    } catch (error) {
      console.log(error);
      console.log("failed to save book");
    }
  }
  return res.json({ succes: true });
};
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const page = req.query.page || 1;
    const allBooks = await BookModal.find({})
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * booksPerPage)
      .limit(booksPerPage);
    if (allBooks.length == 0) {
      return res.json(
        generateResponeType(true, `Data At Page ${page}`, {
          allBooks,
          hasMore: false,
        })
      );
    }
    return res.json(
      generateResponeType(true, `Data At Page ${page}`, {
        allBooks,
        hasMore: true,
      })
    );
  } catch (error) {
    console.log(error);
    return res.json(generateResponeType(false, "Internal Server Error", null));
  }
};
export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.json(generateResponeType(false, "Id Is Required", null));
  }
  try {
    const bookData = await BookModal.findById(id);
    if (!bookData) {
      return res.json(generateResponeType(false, `${id} is Invalid`, null));
    }
    return res.json(
      generateResponeType(true, "Data Fetched Succesful", bookData)
    );
  } catch (error) {
    return res.json(generateResponeType(false, "Internal Server Error", null));
  }
};
export const addBookByUser = async (req: Request, res: Response) => {
  const file = req.file;
  const { title, description, author, genre, userId } = req.body;
  if (!title || !description || !author || !genre || !file || !userId) {
    return res.json(generateResponeType(false, "Data Required", null));
  }
  try {
    const uploadResult: any = await uploadToS3(file);
    const newBook = new BookModal({
      author,
      title,
      description,
      coverImageUrl: uploadResult.Location,
      genre: genre.split(","),
      uploaderUserId: userId,
      publishedDate: new Date(),
    });
    await newBook.save();
    return res.json(generateResponeType(true, "Book Uploaded Succesful", null));
  } catch (error) {
    console.log(error);
    return res.json(generateResponeType(false, "Internal Server Error", null));
  }
};
export const getUserBooks = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    return res.json(generateResponeType(false, "id Required", null));
  }
  try {
    const userBooks = await BookModal.find({ uploaderUserId: userId });
    return res.json(
      generateResponeType(true, "Book Fetched Succesful", userBooks)
    );
  } catch (error) {
    return res.json(generateResponeType(false, "Internal Server Error", null));
  }
};
export const deleteBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.json(generateResponeType(false, "BookId Required", null));
  }
  try {
    await BookModal.findByIdAndDelete(id);
    return res.json(generateResponeType(true, "Book Deleted Succesful", null));
  } catch (error) {
    return res.json(generateResponeType(false, "Internal Server Error", null));
  }
};
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
export const updateBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file;
  const { title, description, author, genre, userId } = req.body;

  if (!title || !description || !author || !genre || !userId || !id) {
    return res.json(generateResponeType(false, "Data Required", null));
  }
  try {
    const book = await BookModal.findById(id);
    if (!book) {
      return res.json(generateResponeType(false, "Book Not Found", null));
    }
    if (book.uploaderUserId != userId) {
      return res.json(generateResponeType(false, "Invalid Update", null));
    }
    const updateData: any = {
      author,
      title,
      description,
      genre: genre.split(","),
    };
    if (file) {
      const uploadResult = await uploadToS3(file);
      updateData.coverImageUrl = uploadResult.Location;
    }

    await BookModal.findByIdAndUpdate(id, updateData);
    return res.json(
      generateResponeType(true, "Book Updated Successfully", null)
    );
  } catch (error) {
    return res.json(generateResponeType(false, "Internal Server Error", null));
  }
};
