// const articleModel = require("../models/article.model");
const { query } = require("express");
const ArticleModel = require("../models/article.model");

const getArticles = async (req, res, next) => {
  try {
    const articles = await ArticleModel.find({});
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

const getArticleByID = async (req, res, next) => {
  const { id } = req.params;
  try {
    const article = await ArticleModel.findById(id);

    if (!article) {
      res.status(404).send(`Article with id:${id} not found!`);
    }

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

const postArticle = async (req, res, next) => {
  const body = req.body;
  try {
    const articleData = new ArticleModel({
      title: body.title,
      article: body.article,
      tags: body.tags,
    });

    // const titleExists = await ArticleModel.findOne({ title });
    // if (titleExists) {
    //   res.status(500).json({ error: `Title must be unique` });
    // }

    // articleData.save().then((savedArticle) => res.json(savedArticle));
    const savedArticle = await articleData.save();
    // savedArticle = ArticleModel.concat(savedArticle);
    res.status(201).json(savedArticle);
  } catch (error) {
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndDelete(req.params.id);
    if (!article) {
      res.status(404).send(`Article with id:${req.params.id} not found!`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const updateArticle = async (req, res, next) => {
  const { id } = req.params;
  const { title, article, tags } = req.body;
  try {
    await ArticleModel.findByIdAndUpdate(
      id,
      { title, article, tags },
      { new: true }
    );
    const updatedArticle = await ArticleModel.findById(id);

    if (!updatedArticle) {
      res.status(404).send(`Article with id:${id} not found!`);
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
};

const searchArticleByTitle = async (req, res, next) => {
  const { title, tags, sortBy, order, page = 1, limit = 5 } = req.query;

  let sortOptions = {};

  if (sortBy) {
    sortOptions[sortBy] = order === "desc" ? -1 : 1;
  }

  const skip = (page - 1) * limit;

  try {
    // const articles = await ArticleModel.find({
    //   title: {
    //     $regex: title,
    //     $options: "i",
    //   },
    //   tags: { $regex: title, $in: tags.split(",") },
    // });

    const filter = {};

    if (title) {
      filter.title = {
        $regex: title,
        $options: "i",
      };
    }

    if (tags) {
      filter.tags = {
        // $regex: tags,
        $in: tags.split(","),
      };
    }
    const totalArticles = await ArticleModel.countDocuments(filter);

    const articles = await ArticleModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      total: totalArticles,
      page: Number(page),
      pages: Math.ceil(totalArticles / limit),
      articles,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticleByID,
  postArticle,
  deleteArticle,
  updateArticle,
  searchArticleByTitle,
};
