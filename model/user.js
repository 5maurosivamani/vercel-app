const mongoose = require("mongoose");

const userScema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  lowerCaseUsername: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userScema);

module.exports = User;
