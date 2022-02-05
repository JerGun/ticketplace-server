const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

router.post("/event", eventController.add);

module.exports = router;
