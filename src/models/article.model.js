const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  article: String,
});

articleSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Article", articleSchema);
