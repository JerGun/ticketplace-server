const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

router.post("/event", eventController.add);
router.get("/event/:tokenId", eventController.findByTokenId);

module.exports = router;
