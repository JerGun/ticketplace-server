const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    tokenId: String,
    eventTimestamp: String,
    eventType: String,
    isMint: Boolean,
    fromAccount: {
      address: String,
      name: String,
    },
    toAccount: {
      address: String,
      name: String,
    },
    seller: {
      address: String,
      name: String,
    },
    buyer: {
      address: String,
      name: String,
    },
    transaction: String,
  },
  { timestamps: false, versionKey: false }
);

const EventModel = mongoose.model("events", eventSchema);

module.exports = EventModel;
