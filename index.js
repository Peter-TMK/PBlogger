const express = require("express");
const app = express();
app.use(express.json());

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
  if (!body.name || !body.article) {
    res.status(404).send({ Error: "Name or Article is missing" });
  }
  const articleExists = articleData.find(
    (article) => article.article === body.article
  );

  if (articleExists) {
    res.status(400).send({ Error: "Article must be unique!" });
  }
  articleData = [...articleData, body];
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

const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
