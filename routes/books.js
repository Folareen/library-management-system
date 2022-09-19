const express = require("express");
const booksRouter = express.Router();
const fs = require("fs");

booksRouter.post("/", (req, res) => {
  const { role, book } = req.body;
  let booksArr;

  if (role !== "admin") {
    return res.status(401).json({ message: "unauthorized!" });
  }

  if (!book || !book.title || !book.author || !book.year) {
    return res.status(400).json({ message: "Invalid Book" });
  }

  try {
    booksArr = JSON.parse(fs.readFileSync("db/books.json", "utf8"));
  } catch (error) {
    console.log(error);
  }

  if (booksArr.find((oldBook) => oldBook.title === book.title)) {
    return res.status(400).json({ message: "Book Exists!" });
  }

  try {
    book.id = booksArr.length + 1;
    booksArr.push(book);
    fs.writeFileSync("db/books.json", JSON.stringify(booksArr));
  } catch (err) {
    console.error(err);
  }

  return res.status(200).json({
    book,
    message: "Book Added Successfully!",
  });
});

booksRouter.delete("/", (req, res) => {
  const { role, book } = req.body;
  let booksArr;

  if (role !== "admin") {
    return res.status(401).json({ message: "unauthorized!" });
  }

  if (!book || !book.title || !book.author || !book.year) {
    return res.status(400).json({ message: "Invalid Book" });
  }

  try {
    booksArr = JSON.parse(fs.readFileSync("db/books.json", "utf8"));
  } catch (error) {
    console.log(error);
  }

  const bookId = booksArr.findIndex((oldBook) => oldBook.title === book.title);

  if (bookId === -1) {
    return res.status(400).json({ message: "book not found!" });
  }

  try {
    booksArr.splice(bookId, 1);
    fs.writeFileSync("db/books.json", JSON.stringify(booksArr));
  } catch (err) {
    console.error(err);
  }

  return res.status(200).json({
    book,
    message: "Book Deleted Successfully!",
  });
});

booksRouter.get("/", (req, res) => {
  const {
    role,
    book: { title },
  } = req.body;
  let booksArr;

  if (!["admin", "visitor"].includes(role)) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  if (!title) {
    return res.status(400).json({ message: "Invalid Book" });
  }

  try {
    booksArr = JSON.parse(fs.readFileSync("db/books.json", "utf8"));
  } catch (error) {
    console.log(error);
  }

  const bookId = booksArr.findIndex((oldBook) => oldBook.title === title);

  if (bookId === -1) {
    return res.status(400).json({ message: "book not found!" });
  }

  return res.status(200).json({ book: booksArr[bookId] });
});

module.exports = booksRouter;
