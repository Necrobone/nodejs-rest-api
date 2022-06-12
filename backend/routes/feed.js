const express = require("express");

const feedController = require("../controllers/feed");
const { postFeedValidation } = require("../middlewares/postFeedValidation");

const router = express.Router();

router.get("/posts", feedController.getPosts);
router.post("/posts", postFeedValidation(), feedController.createPost);
router.get("/posts/:id", feedController.getPost);

module.exports = router;
