const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/verification.controller");

router.get("/all", verificationController.findAll);
router.post("/add", verificationController.add);
router.put("/update", verificationController.edit);

module.exports = router;
