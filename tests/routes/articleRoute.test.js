// tests/routes/articleRoute.test.js
const request = require("supertest");
const app = require("../../app");
const ArticleModel = require("../../src/models/article.model");

jest.mock("../../src/models/article.model");

describe("Article Routes", () => {
  it("GET /api/articles should return all articles", async () => {
    ArticleModel.find.mockResolvedValue([{ title: "Test Article" }]);

    const response = await request(app).get("/api/articles");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ title: "Test Article" }]);
  });

  it("GET /api/articles should handle errors", async () => {
    const error = new Error("Database Error");
    ArticleModel.find.mockRejectedValue(error);

    const response = await request(app).get("/api/articles");

    expect(response.status).toBe(500); // Assuming your error handler returns a 500 status for unhandled errors
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("GET /api/articles/:id should return a single article by ID", async () => {
    ArticleModel.findById.mockResolvedValue({ title: "Test Article" });

    const response = await request(app).get("/api/articles/123");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ title: "Test Article" });
  });

  it("GET /api/articles/:id should handle errors", async () => {
    const error = new Error("Database Error");
    ArticleModel.findById.mockRejectedValue(error);

    const response = await request(app).get("/api/articles/123");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("POST /api/articles should create a new article", async () => {
    const newArticle = { title: "Test Article", article: "Content" };
    ArticleModel.prototype.save.mockResolvedValue(newArticle);

    const response = await request(app)
      .post("/api/articles")
      .send(newArticle)
      .set("Authorization", "Bearer testToken");

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newArticle);
  });

  it("POST /api/articles should handle errors", async () => {
    const error = new Error("Database Error");
    ArticleModel.prototype.save.mockRejectedValue(error);

    const response = await request(app)
      .post("/api/articles")
      .send({ title: "Test Article", article: "Content" })
      .set("Authorization", "Bearer testToken");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("DELETE /api/articles/:id should delete an article", async () => {
    ArticleModel.findByIdAndDelete.mockResolvedValue({});

    const response = await request(app)
      .delete("/api/articles/123")
      .set("Authorization", "Bearer testToken");

    expect(response.status).toBe(204);
  });

  it("DELETE /api/articles/:id should handle errors", async () => {
    const error = new Error("Database Error");
    ArticleModel.findByIdAndDelete.mockRejectedValue(error);

    const response = await request(app)
      .delete("/api/articles/123")
      .set("Authorization", "Bearer testToken");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("PUT /api/articles/:id should update an article", async () => {
    const updatedArticle = {
      title: "Updated Title",
      article: "Updated Content",
    };
    ArticleModel.findByIdAndUpdate.mockResolvedValue(updatedArticle);

    const response = await request(app)
      .put("/api/articles/123")
      .send(updatedArticle)
      .set("Authorization", "Bearer testToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedArticle);
  });

  it("PUT /api/articles/:id should handle errors", async () => {
    const error = new Error("Database Error");
    ArticleModel.findByIdAndUpdate.mockRejectedValue(error);

    const response = await request(app)
      .put("/api/articles/123")
      .send({ title: "Updated Title", article: "Updated Content" })
      .set("Authorization", "Bearer testToken");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("GET /api/articles/search should search articles by title", async () => {
    ArticleModel.find.mockResolvedValue([{ title: "Test Article" }]);

    const response = await request(app).get("/api/articles/search?title=Test");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ title: "Test Article" }]);
  });

  it("GET /api/articles/search should handle errors", async () => {
    const error = new Error("Database Error");
    ArticleModel.find.mockRejectedValue(error);

    const response = await request(app).get("/api/articles/search?title=Test");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });
});
