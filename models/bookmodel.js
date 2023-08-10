const mongoose = require("mongoose");

// define Schema Class
const Schema = mongoose.Schema;

// Create a Schema object
const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: String, required: true }
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;