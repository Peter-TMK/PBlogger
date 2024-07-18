const express = require("express");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
// const articleModel = require("./src/models/article.model");
const errorHandler = require("./src/config/errorHandler");

const articleRouter = require("./src/routes/article.route");
const authRouter = require("./src/routes/auth.route");

const app = express();
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

app.use("/api/articles", articleRouter);
app.use("/api/auth", authRouter);
app.use(errorHandler);

module.exports = app;
