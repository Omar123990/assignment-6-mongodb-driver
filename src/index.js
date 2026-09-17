import express from "express";
import authorRouter from "./module/authors/author.controller.js";
import bookRouter from "./module/books/book.controller.js";
import { databaseConection } from "./database/connection.js";
import { env } from "./config/env.service.js";

const app = express();
app.use(express.json());

// Connect to Database
const database = await databaseConection();

export const authorModel = database.collection("authors");
export const bookModel = database.collection("books");
export const logModel = database.collection("logs");

// Routes
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

const port = env.port || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
