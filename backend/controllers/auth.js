const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = request.body.email;
  const password = request.body.password;
  const name = request.body.name;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
        name,
      });

      return user.save();
    })
    .then((result) => {
      response.status(201).json({
        message: "User created successfully!",
        user: result._id,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.login = (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;
  let loadedUser;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("Email could not be found");
        error.statusCode = 401;
        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          userId: loadedUser._id.toString(),
          email: loadedUser.email,
        },
        "secret",
        {
          expiresIn: "1h",
        }
      );

      response.status(200).json({
        token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
