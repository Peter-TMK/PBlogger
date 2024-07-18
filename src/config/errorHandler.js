const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  }

  if (error.name === "ValidationError" || error.status === 400) {
    return res.status(400).json({ error: error.message });
  }

  // next(error);

  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = errorHandler;
