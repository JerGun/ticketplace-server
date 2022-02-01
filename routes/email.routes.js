const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller");

router.post("/email", emailController.collectEmail);
router.put("/email/update", emailController.updateEmail);
router.get('/email/confirm/:id', emailController.confirmEmail)

module.exports = router;
