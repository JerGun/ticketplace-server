const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    address: String,
    name: String,
    email: String,
    img: String,
    verify: Boolean,
  },
  { timestamps: true, versionKey: false }
);

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
