const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    article: String,
    tags: [{ type: String }],
  },
  { timestamps: true }
);

articleSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Article", articleSchema);
