const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller");

router.post("/email", emailController.confirmEmail);

router.get('/email/confirm/:id', emailController.confirmEmail)

module.exports = router;
