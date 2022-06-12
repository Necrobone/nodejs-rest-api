const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (request, response, next) => {
  Post.find()
    .then((posts) => {
      response.status(200).json({
        message: "Fetched posts successfully",
        posts,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.createPost = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  if (!request.file) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw Error;
  }

  const title = request.body.title;
  const content = request.body.content;
  const imageUrl = request.file.path.replace("\\", "/");

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: {
      name: "Necrobone",
    },
  });

  post
    .save()
    .then((result) => {
      response.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.getPost = (request, response, next) => {
  const id = request.params.id;
  Post.findById(id)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }
      response.status(200).json({
        message: "Post fetched",
        post,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.updatePost = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const id = request.params.id;
  const title = request.body.title;
  const content = request.body.content;
  let imageUrl = request.body.image;

  if (request.file) {
    imageUrl = request.file.path.replace("\\", "/");
  }

  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(id)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;

      return post.save();
    })
    .then((result) => {
      response.status(200).json({
        message: "Post updated successfully!",
        post: result,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, error => console.log(error));
};
