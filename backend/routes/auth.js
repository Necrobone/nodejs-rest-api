const express = require("express");

const authController = require("../controllers/auth");
const { putAuthValidation } = require("../middlewares/putAuthValidation");

const router = express.Router();

router.put("/signup", putAuthValidation(), authController.signup);

module.exports = router;
