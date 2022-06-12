const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");

const MONGODB_URI =
  "mongodb+srv://root:wUkLd5QqMMX7vQgQ@shop.bcjtd.mongodb.net/feeds";

const app = express();

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "images");
  },
  filename: (request, file, callback) => {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (request, file, callback) => {
  const validMimeType = file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg';
  callback(null, validMimeType);
}

app.use(bodyParser.json());
app.use(multer({storage, fileFilter}).single('image'));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  next();
});

app.use("/feed", feedRoutes);

app.use((error, request, response, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;

  response.status(status).json({ message });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(8080);
  })
  .catch((error) => console.log(error));
