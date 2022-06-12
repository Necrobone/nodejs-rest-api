const express = require("express");

const feedController = require("../controllers/feed");
const { postFeedValidation } = require("../middlewares/postFeedValidation");
const { putFeedValidation } = require("../middlewares/putFeedValidation");

const router = express.Router();

router.get("/posts", feedController.getPosts);
router.post("/posts", postFeedValidation(), feedController.createPost);
router.get("/posts/:id", feedController.getPost);
router.put("/posts/:id", putFeedValidation(), feedController.updatePost);

module.exports = router;
