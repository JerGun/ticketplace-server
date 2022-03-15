const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verificationSchema = new Schema(
  {
    address: String,
    fullName: String,
    social: String,
    post: String,
    requestAt: { type : Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

const VerificationModel = mongoose.model("verification", verificationSchema);

module.exports = VerificationModel;
