const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = (request, response, next) => {
  const page = request.query.page || 1;
  const items = 2;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((page - 1) * items)
        .limit(items);
    })
    .then((posts) => {
      response.status(200).json({
        message: "Fetched posts successfully",
        posts,
        totalItems,
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
  const userId = request.userId;
  let creator;

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: userId,
  });

  post
    .save()
    .then(() => {
      return User.findById(userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(() => {
      response.status(201).json({
        message: "Post created successfully!",
        post,
        creator: {
          _id: creator._id,
          name: creator.name,
        },
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

      if (post.creator.toString() !== request.userId) {
        const error = new Error("Not authorized");
        error.statusCode = 403;
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

exports.deletePost = (request, response, next) => {
  const id = request.params.id;
  Post.findById(id)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== request.userId) {
        const error = new Error("Not authorized");
        error.statusCode = 403;
        throw error;
      }

      clearImage(post.imageUrl);

      return Post.findByIdAndRemove(id);
    })
    .then((result) => {
      return User.findById(request.userId);
    })
    .then((user) => {
      user.posts.pull(id);
      return user.save();
    })
    .then((result) => {
      response.status(200).json({
        message: "Post deleted",
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
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (error) => console.log(error));
};
