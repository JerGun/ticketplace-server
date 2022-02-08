const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

router.get("/events", eventController.findAll);
router.post("/event", eventController.add);
router.get("/event/:tokenId", eventController.findByTokenId);
router.post("/event/mint", eventController.findByTokenList);

module.exports = router;
