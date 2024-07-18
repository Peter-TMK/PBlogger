// tests/controllers/articleController.test.js
const {
  searchArticleByTitle,
  getArticles,
  getArticleByID,
  postArticle,
  deleteArticle,
  updateArticle,
} = require("../../src/controllers/article.controller");
const ArticleModel = require("../../src/models/article.model");

jest.mock("../../src/models/article.model");

describe("Article Controller", () => {
  it("should return all articles", async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    ArticleModel.find.mockResolvedValue([{ title: "Test Article" }]);

    await getArticles(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ title: "Test Article" }]);
  });

  it("should handle errors in getArticles", async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const error = new Error("Database Error");
    ArticleModel.find.mockRejectedValue(error);

    await getArticles(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should return a single article by ID", async () => {
    const req = { params: { id: "123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    ArticleModel.findById.mockResolvedValue({ title: "Test Article" });

    await getArticleByID(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ title: "Test Article" });
  });

  it("should handle errors in getArticleByID", async () => {
    const req = { params: { id: "123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const error = new Error("Database Error");
    ArticleModel.findById.mockRejectedValue(error);

    await getArticleByID(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should create a new article", async () => {
    const req = { body: { title: "Test Article", article: "Content" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const savedArticle = { title: "Test Article", article: "Content" };
    ArticleModel.prototype.save.mockResolvedValue(savedArticle);

    await postArticle(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedArticle);
  });

  it("should handle errors in postArticle", async () => {
    const req = { body: { title: "Test Article", article: "Content" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const error = new Error("Database Error");
    ArticleModel.prototype.save.mockRejectedValue(error);

    await postArticle(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should delete an article", async () => {
    const req = { params: { id: "123" } };
    const res = { status: jest.fn().mockReturnThis(), end: jest.fn() };
    const next = jest.fn();

    ArticleModel.findByIdAndDelete.mockResolvedValue({});

    await deleteArticle(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it("should handle errors in deleteArticle", async () => {
    const req = { params: { id: "123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const error = new Error("Database Error");
    ArticleModel.findByIdAndDelete.mockRejectedValue(error);

    await deleteArticle(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  //   it("should update an article", async () => {
  //     const req = {
  //       params: { id: "123" },
  //       body: { title: "Updated Title", article: "Updated Content" },
  //     };
  //     const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  //     const next = jest.fn();

  //     ArticleModel.findByIdAndUpdate.mockResolvedValue({
  //       title: "Updated Title",
  //       article: "Updated Content",
  //     });

  //     await updateArticle(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({
  //       title: "Updated Title",
  //       article: "Updated Content",
  //     });
  //   });

  it("should handle errors in updateArticle", async () => {
    const req = {
      params: { id: "123" },
      body: { title: "Updated Title", article: "Updated Content" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const error = new Error("Database Error");
    ArticleModel.findByIdAndUpdate.mockRejectedValue(error);

    await updateArticle(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  //   it("should search articles by title", async () => {
  //     const req = { query: { title: "Test" } };
  //     const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  //     const next = jest.fn();

  //     ArticleModel.find.mockResolvedValue([{ title: "Test Article" }]);

  //     await searchArticleByTitle(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith([{ title: "Test Article" }]);
  //   });

  //   it("should handle errors in searchArticleByTitle", async () => {
  //     const req = { query: { title: "Test" } };
  //     const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  //     const next = jest.fn();

  //     const error = new Error("Database Error");
  //     ArticleModel.find.mockRejectedValue(error);

  //     await searchArticleByTitle(req, res, next);

  //     expect(next).toHaveBeenCalledWith(error);
  //   });
});
