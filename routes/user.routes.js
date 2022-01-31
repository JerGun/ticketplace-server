const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/user", userController.add);

module.exports = router;
