const express = require("express");

const feedController = require("../controllers/feed");
const { postFeedValidation } = require("../middlewares/postFeedValidation");
const { putFeedValidation } = require("../middlewares/putFeedValidation");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);
router.post("/posts", postFeedValidation(), feedController.createPost);
router.get("/posts/:id", feedController.getPost);
router.put("/posts/:id", putFeedValidation(), feedController.updatePost);
router.delete("/posts/:id", feedController.deletePost);

module.exports = router;
