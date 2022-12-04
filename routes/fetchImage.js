const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/:img_name", (req, res) => {
  const pathArray = __dirname.split("/");
  const newPathArray = pathArray.splice(0, pathArray.length - 1);
  const newPath = newPathArray.join("/");
  const imageName = req.params.img_name;

  var imagePath = path.join(newPath, "public", "images", imageName);

  // for heroku server
  // var newImagePath = "images/" + imageName;

  if (fs.existsSync(imagePath)) {
    res.send(imagePath);
  } else {
    res.status(404).send(imagePath);
  }
});

module.exports = router;
