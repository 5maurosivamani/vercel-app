const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: String,
  content: String,
  image: String,
  date: Date,
  userId: String,
  userName: String,
});

// mongoose Model
const WorkoutPost = mongoose.model("workout_post", PostSchema);

module.exports = WorkoutPost;
