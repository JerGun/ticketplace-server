const UserModel = require("../models/user.model");
const VerificationModel = require("../models/verification.model");

exports.findAll = (req, res) => {
  UserModel.find()
    .then((users) => res.json(users))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findByAddress = (req, res) => {
  const { address } = req.params;
  UserModel.findOne({ address })
    .then((user) => res.json(user))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findByAddressList = (req, res) => {
  const { address } = req.body;
  UserModel.find({ address: { $in: address } })
    .then((users) => res.json(users))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.checkEmailExist = (req, res) => {
  const { email } = req.params;
  UserModel.findOne({ email: email })
    .then((user) => res.json(user))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.add = (req, res) => {
  const payload = req.body;
  const userPayload = {
    address: payload.address,
    email: payload.email,
    name: payload.name,
    verify: payload.verify,
  };
  const verificationPayload = {
    address: payload.address,
    fullName: payload.fullName,
    social: payload.social,
    post: payload.post,
  };
  const user = new UserModel(userPayload);
  const verification = VerificationModel(verificationPayload);
  user
    .save()
    .then(() => {
      verification
        .save()
        .then(res.status(201).end())
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.edit = (req, res) => {
  const payload = req.body;
  UserModel.findOne({ address: payload.address }).then((user) => {
    if (!user) {
      UserModel.create({
        address: payload.address,
        img: payload.img,
      })
        .then(res.status(201).end())
        .catch((err) => console.log(err));
    }
  });
  UserModel.findOneAndUpdate(
    { address: payload.address },
    {
      $set: {
        name: payload.name,
        img: payload.img,
      },
    }
  )
    .then(res.status(200).end())
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};
