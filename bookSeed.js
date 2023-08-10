const mongoose = require('mongoose');
let Book = require("./models/bookmodel");

require('dotenv').config();

const uri = process.env.ATLAS_URI;
console.log("Uri : " + uri);

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);


// Create the table (force drops any existing table)
(async () => {
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log("MongoDB database connection established successfully");      

        listOfBooks = [
            { "title": "Civilization", "author": "Tzu", "year": "1922" },
            { "title": "Urbanization", "author": "Richards", "year": "1955" },
            { "title": "Concuring the World", "author": "Alexander", "year": "1022" }
        ]

        listOfBooks.map((item) => {

            title = item.title;
            author = item.author;
            year = item.year;

            const newBook = new Book({
                title,
                author,
                year
            });

            newBook
                .save()
                .then(() => console.log("Book added!"))
                .catch((err) => console.log("Error: " + err));
        })
    });
})();
