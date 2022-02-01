const UserModel = require("../models/user.model");

exports.findAll = (req, res) => {
  UserModel.find()
    .then((users) => res.json(users))
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};

exports.findAddress = (req, res) => {
  const { address } = req.params;
  UserModel.findOne({ address })
    .then((user) => {
      if (!user) {
        res.json(false);
      } else {
        res.json(user.verify);
      }
    })
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};

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
