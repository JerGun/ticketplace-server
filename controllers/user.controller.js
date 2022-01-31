const res = require("express/lib/response");
const UserModel = require("../models/user.model");

exports.findAll = (req, res) => {};

exports.add = (req, res) => {
  const payload = req.body;
  const user = new UserModel(payload);
  user
    .save()
    .then(res.status(201).end())
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.edit = (req, res) => {};
