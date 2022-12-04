const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
var _ = require("lodash");

const User = require("../model/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwtKey = "Konjam_Ulari_Kottava";

router.post("/new", (req, res) => {
  const username = req.body.username;
  const myPlaintextPassword = req.body.password;

  User.findOne({ lowerCaseUsername: _.toLower(username) }, (err, doc) => {
    if (doc) {
      // console.log(doc);
      res.send("exist");
    } else {
      bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
        if (!err) {
          const newUser = new User({
            username: req.body.username,
            lowerCaseUsername: _.toLower(req.body.username),
            password: hash,
          });

          newUser.save((err) => {
            if (err) {
              res.send("failed");
            } else {
              res.send("success");
            }
          });
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  const userName = req.body.username;
  const myPlaintextPassword = req.body.password;
  const filterUser = {
    username: userName,
  };

  User.findOne(filterUser, async (err, user) => {
    if (err) {
      res.send(err);
    }

    if (!user) {
      res.send({ status: "invalid-user" });
    } else {
      const cmp = await bcrypt.compare(myPlaintextPassword, user.password);
      if (cmp) {
        const id = user._id;
        const token = jwt.sign({ id }, jwtKey, {
          expiresIn: 300 * 12,
        });

        req.session.userInfo = {
          username: user.username,
          userid: user._id,
        };

        res.json({
          status: "valid",
          username: user.username,
          userid: user._id,
          token: token,
        });
      } else {
        res.json({ status: "invalid-password" });
      }
    }
  });
});

const verifyJwt = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.send("Yo, we need a token. Please give it to us next time.");
  } else {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "You failed to authenticate." });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

router.get("/auth", verifyJwt, (req, res) => {
  res.json({ auth: true, message: "Yo, you are authenticated. Congrats!" });
});

router.delete("/logout", (req, res) => {
  if (req.session.userInfo) {
    req.session.destroy((err) => {
      if (!err) {
        res.send({ loggedIn: false });
      }
    });
  } else {
    res.send({ loggedIn: false });
  }
});

router.get("/", (req, res) => {
  User.find({}, (err, docs) => {
    if (err) {
      res.send(err);
    }

    if (!docs) {
      res.send("No Records Found.");
    } else {
      res.send(docs);
    }
  });
});

router.get("/:id", (req, res) => {
  User.findById({ _id: req.params.id }, (err, doc) => {
    if (err) {
      res.send(err);
    }

    if (!doc) {
      res.send("No Records Found.");
    } else {
      res.send(doc);
    }
  });
});

router.get("/deleteall", (req, res) => {
  User.deleteMany({}, (err, doc) => {
    if (!err) {
      console.log(doc);
    }
  });
});

module.exports = router;
