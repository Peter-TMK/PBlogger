const express = require("express");
const app = express();
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const articleModel = require("./src/models/article.model");
app.use(express.json());

connectDB();
// Defining a custom token for morgan to log the request body for POST requests
morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

// Middleware for logging with custom format
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

let articleData = [
  { id: 1, name: "Henry", article: "A golden finger" },
  { id: 2, name: "Maggie", article: "Games of throne" },
  { id: 3, name: "James", article: "Jack Richer" },
  { id: 4, name: "Cassie", article: "The spy who loved me" },
  { id: 5, name: "Tim", article: "Abridge too far" },
];
// console.log(...articleData);
// Get All Articles
app.get("/api/articles", (req, res) => {
  console.log("testing endpoint");
  res.json(articleData);
});

// Get a single Article
app.get("/api/articles/:id", (req, res) => {
  const id = +req.params.id;
  //   console.log(typeof id);
  const article = articleData.find((article) => article.id === id);
  if (!article) {
    res.status(404).send(`Article with id:${id} not found!`);
  }

  res.json(article);
});

// Create an article
app.post("/api/articles", (req, res) => {
  const body = req.body;
  if (!body.title || !body.article) {
    res.status(404).send({ Error: "Title or Article is missing" });
  }
  const titleExists = articleModel.find(
    (article) => article.title === body.title
  );

  if (titleExists) {
    res.status(400).send({ Error: "Title/Article must be unique!" });
  }
  articleModel = [...articleModel, body];
  res.status(200).send(articleData);
  // .save();
  //   console.log(...articleData, body);
});

app.delete("/api/articles/:id", (req, res) => {
  const id = Number(req.params.id);
  let article = articleData.filter((article) => article.id !== id);
  //   console.log(article);
  res.send(article);
});

module.exports = app;
