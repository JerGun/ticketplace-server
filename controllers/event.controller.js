const EventModel = require("../models/event.model");
const UserModel = require("../models/user.model");

exports.findAll = (req, res) => {
  EventModel.find()
    .then((events) => res.json(events))
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};

exports.findByTokenId = (req, res) => {
  const { tokenId } = req.params;
  EventModel.find({ tokenId: tokenId })
    .then((event) => res.json(event))
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};

exports.findByTokenList = (req, res) => {
  const { tokenList } = req.body;
  EventModel.find({ tokenId: { $in: tokenList }, eventType: "Minted" })
    .then((events) => {
      let meta = [];
      let address = [];
      for (let i = 0; i <= events.length; i++) {
        if (events[i]) {
          meta.push({
            tokenId: events[i].tokenId,
            address: events[i].toAccount.address,
          });
          address.push(events[i].toAccount.address);
        }
      }
      UserModel.find({ address: { $in: address } })
        .then((user) => {
          for (let i = 0; i <= user.length; i++)
            if (user[i]) {
              let metaFilter = meta.filter((el) => {
                return el.address === user[i].address;
              });
              console.log(metaFilter);
              for (let j = 0; j < metaFilter.length; j++) {
                metaFilter[j].name = user[i].name;
              }
            }
          res.json(meta);
        })
        .catch((e) => {
          res.status(500).send({ message: e.message });
        });
    })
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
          payload.fromAccount.name = payload.fromAccount.address
            .slice(2, 9)
            .toUpperCase();
        }
        event = new EventModel(payload);
        if (payload.toAccount) {
          UserModel.findOne({ address: payload.toAccount.address })
            .then((toUser) => {
              if (toUser) {
                payload.toAccount.name = toUser.name;
              } else {
                payload.toAccount.name = payload.toAccount.address
                  .slice(2, 9)
                  .toUpperCase();
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
