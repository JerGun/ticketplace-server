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
      isVerify: Boolean,
    },
    toAccount: {
      address: String,
      name: String,
      isVerify: Boolean,
    },
    seller: {
      address: String,
      name: String,
      isVerify: Boolean,
    },
    buyer: {
      address: String,
      name: String,
      isVerify: Boolean,
    },
    price: String,
    quantity: String,
    transaction: String,
  },
  { timestamps: false, versionKey: false }
);

const EventModel = mongoose.model("events", eventSchema);

module.exports = EventModel;
