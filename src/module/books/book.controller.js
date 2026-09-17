import { Router } from "express";
import {
  createBooksCollection,
  createCappedLogsCollection,
  createTitleIndexOnBooks,
  deleteBooksBeforeYearService,
  getBookByTitleService,
  getBooksAggregate1Service,
  getBooksAggregate2Service,
  getBooksAggregate3Service,
  getBooksAggregate4Service,
  getBooksByGenreService,
  getBooksByYearRangeService,
  getBooksExcludingGenresService,
  getBooksSkipLimitService,
  getBooksWithIntegerYearService,
  insertLogService,
  insertManyBooks,
  insertOneBook,
  updateBookYearByTitle,
} from "./book.service.js";

const bookRouter = Router();

bookRouter.post("/collection", async (req, res) => {
  try {
    const data = await createBooksCollection();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.post("/collection/logs/capped", async (req, res) => {
  try {
    const data = await createCappedLogsCollection();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.post("/collection/books/index", async (req, res) => {
  try {
    const data = await createTitleIndexOnBooks();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

bookRouter.post("/", async (req, res) => {
  try {
    const data = await insertOneBook(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.post("/batch", async (req, res) => {
  try {
    const data = await insertManyBooks(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.post("/logs", async (req, res) => {
  try {
    const data = await insertLogService(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.patch("/:title", async (req, res) => {
  try {
    const targetTitle = req.query.title || req.params.title;
    const year = req.body.publishedYear || 2022;

    const data = await updateBookYearByTitle(targetTitle, year);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/title", async (req, res) => {
  try {
    const { title } = req.query;
    const data = await getBookByTitleService(title);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/year", async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await getBooksByYearRangeService(from, to);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/genre", async (req, res) => {
  try {
    const { genre } = req.query;
    const data = await getBooksByGenreService(genre);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/skip-limit", async (req, res) => {
  try {
    const data = await getBooksSkipLimitService();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/year-integer", async (req, res) => {
  try {
    const data = await getBooksWithIntegerYearService();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/exclude-genres", async (req, res) => {
  try {
    const data = await getBooksExcludingGenresService();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.delete("/before-year", async (req, res) => {
  try {
    const { year } = req.query;
    const data = await deleteBooksBeforeYearService(year || 2000);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/aggregate1", async (req, res) => {
  try {
    const data = await getBooksAggregate1Service();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/aggregate2", async (req, res) => {
  try {
    const data = await getBooksAggregate2Service();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/aggregate3", async (req, res) => {
  try {
    const data = await getBooksAggregate3Service();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/aggregate4", async (req, res) => {
  try {
    const data = await getBooksAggregate4Service();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default bookRouter;
