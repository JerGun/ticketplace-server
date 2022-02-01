const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/accounts", userController.findAll);
router.get("/account/:address", userController.findAddress);
router.post("/account", userController.add);
router.put("/account/update", userController.edit)

module.exports = router;
