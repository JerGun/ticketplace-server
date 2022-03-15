const VerificationModel = require("../models/verification.model");
const UserModel = require("../models/user.model");

exports.findAll = (req, res) => {
    VerificationModel.find()
      .then((users) => res.json(users))
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  };

exports.add = (req, res) => {
  const payload = req.body;
  const verification = new VerificationModel(payload);
  verification
    .save()
    .then(res.status(201).end())
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.edit = (req, res) => {
  const payload = req.body;
  VerificationModel.findOneAndUpdate(
    { address: payload.address },
    {
      $set: {
        fullName: payload.fullName,
        social: payload.social,
        post: payload.post,
        requestDate: payload.requestDate,
      },
    }
  )
    .then(res.status(200).end())
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};
