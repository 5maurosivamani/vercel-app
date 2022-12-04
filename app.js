const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server started at PORT: ${PORT}`);
  }
});
