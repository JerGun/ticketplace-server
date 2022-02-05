const EventModel = require("../models/event.model");
const UserModel = require("../models/user.model");

exports.findByTokenId = (req, res) => {
  const { tokenId } = req.params;
  EventModel.find({ tokenId: tokenId })
    .then((user) => res.json(user))
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};

exports.add = (req, res) => {
  const payload = req.body;

  let event;

  if (payload.isMint) {
    UserModel.findOne({ address: payload.toAccount.address })
      .then((user) => {
        payload.toAccount.name = user.name;
        event = new EventModel(payload);
        event
          .save()
          .then(res.status(201).end())
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    UserModel.findOne({ address: payload.fromAccount.address })
      .then((fromUser) => {
        if (fromUser) {
          payload.fromAccount.name = fromUser.name;
        } else {
          payload.fromAccount.name = payload.fromAccount.address.slice(2, 9);
        }
        event = new EventModel(payload);
        if (payload.toAccount) {
          UserModel.findOne({ address: payload.toAccount.address })
            .then((toUser) => {
              if (toUser) {
                payload.toAccount.name = toUser.name;
              } else {
                payload.toAccount.name = payload.toAccount.address.slice(2, 9);
              }
              event = new EventModel(payload);
            })
            .catch((err) => {
              res.status(500).send({ message: err.message });
            });
        }
        event
          .save()
          .then(res.status(201).end())
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};
