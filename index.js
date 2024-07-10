const express = require("express");
const app = express();

app.get("/test", (req, res) => {
  console.log("testing endpoint");
  res.send("testing endpoint");
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
