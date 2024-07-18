const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "malformatted id" });
  }

  next();
};

module.exports = validateObjectId;
