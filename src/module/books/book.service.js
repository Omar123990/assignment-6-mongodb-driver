import { bookModel, logModel } from "../../index.js";

export const createBooksCollection = async () => {
  const db = bookModel.db;

  await db.createCollection("books", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title"],
        properties: {
          title: {
            bsonType: "string",
            minLength: 1,
            description: "title must be a non-empty string and is required",
          },
        },
      },
    },
  });

  return {
    message: "Books collection created successfully with validation rule",
  };
};

export const createCappedLogsCollection = async () => {
  const db = bookModel.db;

  const collections = await db.listCollections({ name: "logs" }).toArray();
  if (collections.length > 0) {
    return new Error("Collection 'logs' already exists");
  }

  await db.createCollection("logs", {
    capped: true,
    size: 1048576,
  });

  return {
    message: "Capped collection 'logs' created successfully (1MB limit)",
  };
};

export const createTitleIndexOnBooks = async () => {
  const result = await bookModel.createIndex({ title: 1 });

  return {
    message: "Index created successfully on 'title' field",
    indexName: result,
  };
};

export const insertOneBook = async (bookData) => {
  if (!bookData || Object.keys(bookData).length === 0) {
    throw new Error("Book data is required");
  }

  if (
    !bookData.title ||
    typeof bookData.title !== "string" ||
    bookData.title.trim() === ""
  ) {
    throw new Error("Title field is required and must be a non-empty string");
  }

  const result = await bookModel.insertOne(bookData);
  return {
    message: "Book inserted successfully",
    insertedId: result.insertedId,
  };
};

export const insertManyBooks = async (booksArray) => {
  if (!Array.isArray(booksArray) || booksArray.length === 0) {
    throw new Error("An array of books is required");
  }

  if (booksArray.length < 3) {
    throw new Error("You must insert at least three books in batch mode");
  }

  for (const book of booksArray) {
    if (
      !book.title ||
      typeof book.title !== "string" ||
      book.title.trim() === ""
    ) {
      throw new Error("Each book must contain a non-empty string title field");
    }
  }

  const result = await bookModel.insertMany(booksArray);
  return {
    message: `${result.insertedCount} books inserted successfully`,
    insertedIds: result.insertedIds,
  };
};

export const insertLogService = async (logData) => {
  if (!logData || Object.keys(logData).length === 0) {
    throw new Error("Log data is required");
  }

  const logToInsert = {
    ...logData,
    createdAt: logData.createdAt || new Date(),
  };

  const result = await logModel.insertOne(logToInsert);
  return {
    message: "Log inserted successfully",
    insertedId: result.insertedId,
  };
};

export const updateBookYearByTitle = async (searchTitle, newYear) => {
  if (!searchTitle || searchTitle.trim() === "") {
    throw new Error("Book title is required for update");
  }

  const result = await bookModel.updateOne(
    { title: searchTitle },
    { $set: { publishedYear: newYear } },
  );

  if (result.matchedCount === 0) {
    throw new Error(`No book found with title '${searchTitle}'`);
  }

  return {
    message: "Book updated successfully",
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

export const getBookByTitleService = async (title) => {
  if (!title || title.trim() === "") {
    throw new Error("Book title query parameter is required");
  }

  const book = await bookModel.findOne({ title: title });

  if (!book) {
    throw new Error(`No book found with title '${title}'`);
  }

  return {
    message: "Book found successfully",
    book,
  };
};

export const getBooksByYearRangeService = async (fromYear, toYear) => {
  const from = Number(fromYear);
  const to = Number(toYear);

  if (isNaN(from) || isNaN(to)) {
    throw new Error("'from' and 'to' query parameters must be valid numbers");
  }

  const books = await bookModel
    .find({
      publishedYear: { $gte: from, $lte: to },
    })
    .toArray();

  return {
    message: `Found ${books.length} book(s) published between ${from} and ${to}`,
    count: books.length,
    books,
  };
};

export const getBooksByGenreService = async (genre) => {
  if (!genre || genre.trim() === "") {
    throw new Error("Genre query parameter is required");
  }

  const books = await bookModel.find({ genres: genre }).toArray();

  return {
    message: `Found ${books.length} book(s) with genre '${genre}'`,
    count: books.length,
    books,
  };
};

export const getBooksSkipLimitService = async () => {
  const books = await bookModel
    .find()
    .sort({ publishedYear: -1 })
    .skip(2)
    .limit(3)
    .toArray();

  return {
    message:
      "Skipped 2 books, limited to 3, sorted by publishedYear descending",
    count: books.length,
    books,
  };
};

export const getBooksWithIntegerYearService = async () => {
  const books = await bookModel
    .find({
      publishedYear: { $type: "int" },
    })
    .toArray();

  return {
    message: "Books with integer year retrieved successfully",
    count: books.length,
    books,
  };
};

export const getBooksExcludingGenresService = async () => {
  const books = await bookModel
    .find({
      genres: { $nin: ["Horror", "Science Fiction"] },
    })
    .toArray();

  return {
    message:
      "Books excluding Horror and Science Fiction retrieved successfully",
    count: books.length,
    books,
  };
};

export const deleteBooksBeforeYearService = async (yearQuery) => {
  const targetYear = Number(yearQuery);

  if (isNaN(targetYear)) {
    throw new Error("'year' query parameter must be a valid number");
  }

  const result = await bookModel.deleteMany({
    publishedYear: { $lt: targetYear },
  });

  return {
    message: `Books published before ${targetYear} deleted successfully`,
    deletedCount: result.deletedCount,
  };
};

export const getBooksAggregate1Service = async () => {
  const books = await bookModel
    .aggregate([
      {
        $match: {
          publishedYear: { $gt: 2000 },
        },
      },
      {
        $sort: {
          publishedYear: -1,
        },
      },
    ])
    .toArray();

  return {
    message:
      "Books filtered and sorted using aggregation pipeline successfully",
    count: books.length,
    books,
  };
};

export const getBooksAggregate2Service = async () => {
  const books = await bookModel
    .aggregate([
      {
        $match: {
          publishedYear: { $gt: 2000 },
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          author: 1,
          publishedYear: 1,
        },
      },
    ])
    .toArray();

  return {
    message: "Books retrieved using aggregation projection successfully",
    count: books.length,
    books,
  };
};
export const getBooksAggregate3Service = async () => {
  const books = await bookModel
    .aggregate([
      {
        $unwind: "$genres",
      },
    ])
    .toArray();

  return {
    message: "Genres unwound into separate documents successfully",
    count: books.length,
    books,
  };
};

export const getBooksAggregate4Service = async () => {
  const books = await bookModel
    .aggregate([
      {
        $lookup: {
          from: "logs",
          localField: "title",
          foreignField: "bookTitle",
          as: "bookLogs",
        },
      },
    ])
    .toArray();

  return {
    message: "Books joined with logs collection successfully",
    count: books.length,
    books,
  };
};
