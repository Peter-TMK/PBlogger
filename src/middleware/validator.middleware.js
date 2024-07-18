const Joi = require("joi");
// const articleModel = require("../models/article.model");
const articleModel = require("../models/article.model"); // Adjust the path as necessary

// Custom validation function to check for unique title
const uniqueTitle = async (value, helpers) => {
  const existingArticle = await articleModel.findOne({ title: value });
  if (existingArticle) {
    throw new Error("Title must be unique");
  }
  return value;
};

const validateArticlePost = Joi.object({
  title: Joi.string().min(3).max(50).required().external(uniqueTitle),
  article: Joi.string().min(5).max(1000),
  tags: Joi.array().items(Joi.string()).optional(),
});

const validateArticleUpdate = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  article: Joi.string().min(5).max(1000),
  tags: Joi.array().items(Joi.string()).optional(),
});

const validateRegister = Joi.object({
  // email: Joi.string().required().email(),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ng", "co", "za", "uk"] },
    }),
  password: Joi.string().required(),
});

async function validateRegisterMiddleWare(req, res, next) {
  const payload = req.body;
  try {
    await validateRegister.validateAsync(payload, { abortEarly: false });
    next();
  } catch (error) {
    // res.status(400).json({ error: error.details[0].message });
    next({
      // message: error.details[0].message,
      message: error.message,
      status: 400,
    });
  }
}
async function validateArticlePostMiddleWare(req, res, next) {
  const payload = req.body;
  try {
    await validateArticlePost.validateAsync(payload, { abortEarly: false });
    next();
  } catch (error) {
    // res.status(400).json({ error: error.details[0].message });
    next({
      // message: error.details[0].message,
      message: error.message,
      status: 400,
    });
  }
}

async function validateArticleUpdateMiddleWare(req, res, next) {
  const payload = req.body;
  try {
    await validateArticleUpdate.validateAsync(payload, { abortEarly: false });
    next();
  } catch (error) {
    // res.status(400).json({ error: error.details[0].message });
    next({
      // message: error.details[0].message,
      message: error.message,
      status: 400,
    });
  }
}

module.exports = {
  validateArticlePostMiddleWare,
  validateArticleUpdateMiddleWare,
  validateRegisterMiddleWare,
};

// const Joi = require("joi");
// const articleModel = require("../models/article.model"); // Import the article model

// const validateUniqueTitle = async (value, helpers) => {
//   const existingArticle = await articleModel.findOne({ title: value });
//   if (existingArticle) {
//     throw new Error("Title must be unique");
//   }
//   return value;
// };

// const validateArticlePost = Joi.object({
//   title: Joi.string().min(3).max(50).required().external(validateUniqueTitle),
//   article: Joi.string().min(5).max(1000).required(),
// });

// const validateArticleUpdate = Joi.object({
//   title: Joi.string().min(3).max(50).required().external(validateUniqueTitle),
//   article: Joi.string().min(5).max(1000).required(),
// });

// async function validateArticlePostMiddleWare(req, res, next) {
//   const payload = req.body;
//   try {
//     await validateArticlePost.validateAsync(payload, { abortEarly: false });
//     next();
//   } catch (error) {
//     next({
//       message: error.details[0].message,
//       status: 400,
//     });
//   }
// }

// async function validateArticleUpdateMiddleWare(req, res, next) {
//   const payload = req.body;
//   try {
//     await validateArticleUpdate.validateAsync(payload, { abortEarly: false });
//     next();
//   } catch (error) {
//     next({
//       message: error.details[0].message,
//       status: 400,
//     });
//   }
// }

// module.exports = {
//   validateArticlePostMiddleWare,
//   validateArticleUpdateMiddleWare,
// };
