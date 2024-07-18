const express = require("express");
const articleRouter = express.Router();

const {
  getArticles,
  getArticleByID,
  postArticle,
  deleteArticle,
  updateArticle,
  searchArticleByTitle,
} = require("../controllers/article.controller");

const {
  validateArticlePostMiddleWare,
  validateArticleUpdateMiddleWare,
} = require("../middleware/validator.middleware");

const authenticate = require("../middleware/auth.middleware");
const validateObjectId = require("../middleware/validateObjectId");

// Search Articles By Title
articleRouter.get("/search", searchArticleByTitle); // Place search route before ID-based route

// Get All Articles
articleRouter.get("/", getArticles);

// Get a single Article
articleRouter.get("/:id", validateObjectId, getArticleByID);

// Another option is to use chaining
// articleRouter.get("/", getArticles).get("/:id", getArticleByID);

// Create an article
articleRouter.post(
  "/",
  authenticate,
  validateArticlePostMiddleWare,
  postArticle
);

// Delete an article
articleRouter.delete("/:id", authenticate, validateObjectId, deleteArticle);

// Update an article
articleRouter.put(
  "/:id",
  authenticate,
  validateObjectId,
  validateArticleUpdateMiddleWare,
  updateArticle
);

module.exports = articleRouter;
