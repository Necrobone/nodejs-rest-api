const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (request, response) => {
  return response.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        image:
          "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
        creator: {
          name: "Necrobone",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const title = request.body.title;
  const content = request.body.content;

  const post = new Post({
    title,
    content,
    imageUrl:
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
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
