const express = require("express");
const router = express.Router();

// Routes
router.get("/", (req, res) => {
  res.send("<h1>This is the Home Route.</h1>");
});

module.exports = router;
