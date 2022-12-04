const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const multer = require("multer");
// const forms = multer();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

require("dotenv").config();
const port = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.use(forms.array());

app.use(
  cors({
    origin: process.env.CLINT_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use(fileUpload({}));

// Database Connection
mongoose.connect(process.env.DATABASE_URL);

mongoose.connection.on("open", () => {
  console.log("Database Connected Successfully!");
});

mongoose.connection.on("error", () => {
  console.log("Database Connection Failed!");
});

const indexRoute = require("./routes/index");
const postsRoute = require("./routes/posts");
const usersRoute = require("./routes/users");
const uploadRoute = require("./routes/uploadImage");
const fetchImage = require("./routes/fetchImage");

app.use("/server/", indexRoute);
app.use("/server/posts", postsRoute);
app.use("/server/users", usersRoute);
app.use("/server/upload", uploadRoute);
app.use("/server/images", fetchImage);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Listen Port
app.listen(port, (err) => {
  if (err) {
    console.log("Server connection failed!");
  }
  console.log(`Server connected Successfully at PORT ${port}.`);
});
