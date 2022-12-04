const express = require("express");
const router = express.Router();

const WorkoutPost = require("../model/post");

// get all posts Route
router.get("/", (req, res) => {
  WorkoutPost.find((err, data) => {
    if (err) {
      console.log("Failed to Retrive the posts.");
    }

    res.send(data);
  });
});

// Paginate posts
router.get("/page/:pageno", (req, res) => {
  const pageNo = req.params.pageno || 1;
  const limit = 5;

  WorkoutPost.find()
    .skip((pageNo - 1) * limit)
    .limit(limit)
    .exec(function (err, doc) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json(doc);
    });
});

// Total posts count
router.get("/total", (req, res) => {
  WorkoutPost.find().count(function (err, total) {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json({ total });
  });
});

// get Individual Post
router.get("/:id", (req, res) => {
  WorkoutPost.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) {
      console.log("Failed to Retrive the posts.");
    }

    res.send(doc);
  });
});

// Insert a new Post Route
router.post("/new", (req, res) => {
  const postData = {
    ...req.body,
    userId: req.body.userid,
    userName: req.body.username,
  };
  const newPost = new WorkoutPost(postData);
  newPost.save((err) => {
    if (err) {
      res.send({ status: "faliled", error: err });
    }

    res.send({ status: "success" });
  });
});

// Delete Particular Post
router.delete("/:id", (req, res) => {
  const postId = req.params.id;
  WorkoutPost.deleteOne({ _id: postId }, (err, doc) => {
    if (err) {
      console.log("Deletion Failed!");
    }
    if (!doc) {
      console.log("No Post found at this post Id.");
      res.send("No Post found at this post Id.");
    } else {
      console.log("Successfully Deleted!");
      res.send("Successfully Deleted!");
    }
  });
});

// Update the Particular Record
router.put("/:id", (req, res) => {
  const postId = req.params.id;

  const updatePost = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
  };

  WorkoutPost.updateOne({ _id: postId }, updatePost, (err, doc) => {
    if (!doc) {
      console.log("No Post found this postid.");
      res.send("No Post found this postid.");
    }

    if (err) {
      console.log("Updation Failed");
      res.send({ status: "success", err: err });
    }

    console.log("Successfully Updated!");
    res.send({ status: "success" });
  });
});

module.exports = router;
