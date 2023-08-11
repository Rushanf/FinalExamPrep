const mongoose = require('mongoose');
let Book = require("./models/bookmodel");
const cors = require('cors');
(express = require('express')), (app = express());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json())

require('dotenv').config();
const port = process.env.PORT || 3000;

//const uri = process.env.URI;
const uri = process.env.ATLAS_URI;
console.log("Uri : " + uri);
//mongoose.connect(uri);
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


app.get('/', (req, res) => {
  Book.find()
    .then((record) => res.json(record))
    .catch((err) => res.status(500).json("Error: " + err));
});

app.get('/:id', (req, res) => {
  Book.findById(req.params.id)
    .then((record) => res.json(record))
    .catch((err) => res.status(500).json("Error: " + err));
});

app.get('/search/:title', (req, res) => {
  const filter = { "title": req.params.title };
  Book.find(filter)
    .then((record) => res.json(record))
    .catch((err) => res.status(500).json("Error: " + err));
});

app.post('/', (req, res) => {

  title = req.body.title;
  author = req.body.author;
  year = req.body.year;

  const record = new Book({
    title,
    author,
    year
  });

  record
    .save()
    .then(() => res.send(record))
    .catch((err) => res.status(500).json("Error: " + err));
});

app.put("/:id", (req, res) => {

  Book.findById(req.params.id)
    .then((books) => {
      books.title = req.body.title;
      books.author = req.body.author;
      books.year = req.body.year;

      books
        .save()
        .then(() => res.json("Book updated!"))
        .catch((err) => res.status(500).json("Error: " + err));
    })
    .catch((err) => res.status(500).json("Error: " + err));
});

app.put("/title/:title",(req, res) => {
  const filter = { "title": req.params.title };
  const update = { "year": req.body.year };

  console.log(filter);
  console.log(update);

  Book.findOneAndUpdate(filter, update, {upsert: true}, function(err, doc) {
      if (err) return res.status(500).send({error: err});
      return res.send('Succesfully saved.');
  });
 });

 app.delete("/deleteall/all",(req, res) => {
  console.log("Delete all");
Book.deleteMany({})
  .then(() => res.json("All Books deleted."))
  .catch((err) => res.status(500).json("Error: " + err));
});

app.delete("/:id",(req, res) => {
    Book.findByIdAndDelete(req.params.id)
      .then(() => res.json("Book deleted."))
      .catch((err) => res.status(500).json("Error: " + err));
  });

  app.delete("/author/:author",(req, res) => {
  const filter = { "author": req.params.author };

  console.log(filter);

  Book.deleteMany(filter, (err) => {
      if (err) return res.status(500).send({error: err});
      return res.send('Succesfully Deleted.');
  });
});

// app.delete("/quotes/:id", async(req,res, next) => {
//   try {
//       const quote = await records.getQuote(req.params.id);
//       await records.deleteQuote(quote);
//       res.status(204).end();
//   } catch(err){
//       next(err);
//   }
// });
// Send a GET request to /quotes/quote/random to READ (view) a random quote

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
      error: {
          message: err.message
      }
  })
});



app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});