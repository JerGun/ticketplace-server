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
    .then(async (events) => {
      let newEvents = [];
      let payload;
      for (let i = 0; i < events.length; i++) {
        payload = events[i];
        if (payload.isMint) {
          let user = await UserModel.findOne({
            address: payload.toAccount.address,
          });
          payload.toAccount.name = user.name;
          newEvents.push(payload);
        } else {
          if (
            Object.keys(payload.fromAccount).length === 0 &&
            Object.keys(payload.toAccount).length === 0
          ) {
            let fromUser = await UserModel.findOne({
              address: payload.fromAccount.address,
            });
            let toUser = await UserModel.findOne({
              address: payload.toAccount.address,
            });
            if (fromUser) payload.fromAccount.name = fromUser.name;
            else
              payload.fromAccount.name = payload.fromAccount.address
                .slice(2, 9)
                .toUpperCase();
            if (toUser) payload.toAccount.name = toUser.name;
            else
              payload.toAccount.name = payload.toAccount.address
                .slice(2, 9)
                .toUpperCase();

            newEvents.push(payload);
          } else if (payload.fromAccount) {
            let fromUser = await UserModel.findOne({
              address: payload.fromAccount.address,
            });
            if (fromUser) payload.fromAccount.name = fromUser.name;
            else
              payload.fromAccount.name = payload.fromAccount.address
                .slice(2, 9)
                .toUpperCase();
            newEvents.push(payload);
          } else if (payload.toAccount) {
            let toUser = await UserModel.findOne({
              address: payload.toAccount.address,
            });
            if (toUser) payload.toAccount.name = toUser.name;
            else
              payload.toAccount.name = payload.toAccount.address
                .slice(2, 9)
                .toUpperCase();
            newEvents.push(payload);
          }
        }
      }
      res.json(newEvents);
    })
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

  let event = new EventModel(payload);
  event
    .save()
    .then(res.status(201).end())
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });

  // if (payload.isMint) {
  //   UserModel.findOne({ address: payload.toAccount.address })
  //     .then((user) => {
  //       payload.toAccount.name = user.name;
  //       event = new EventModel(payload);
  //       event
  //         .save()
  //         .then(res.status(201).end())
  //         .catch((err) => {
  //           res.status(500).send({ message: err.message });
  //         });
  //     })
  //     .catch((err) => {
  //       res.status(500).send({ message: err.message });
  //     });
  // } else {
  //   if (payload.fromAccount && payload.toAccount) {
  //     let address = [payload.fromAccount.address, payload.toAccount.address];
  //     UserModel.find({ address: { $in: address } })
  //       .then((user) => {
  //         let userFilter;
  //         userFilter = user.filter((el) => {
  //           return el.address === payload.fromAccount.address;
  //         });
  //         if (userFilter.length > 0)
  //           payload.fromAccount.name = userFilter[0].name;
  //         else
  //           payload.fromAccount.name = payload.fromAccount.address
  //             .slice(2, 9)
  //             .toUpperCase();

  //         userFilter = user.filter((el) => {
  //           return el.address === payload.toAccount.address;
  //         });
  //         if (userFilter.length > 0)
  //           payload.toAccount.name = userFilter[0].name;
  //         else
  //           payload.toAccount.name = payload.toAccount.address
  //             .slice(2, 9)
  //             .toUpperCase();

  //         event = new EventModel(payload);
  //         event
  //           .save()
  //           .then(res.status(201).end())
  //           .catch((err) => {
  //             res.status(500).send({ message: err.message });
  //           });
  //       })
  //       .catch((err) => {
  //         res.status(500).send({ message: err.message });
  //       });
  //   } else if (payload.fromAccount && !payload.toAccount) {
  //     UserModel.findOne({ address: payload.fromAccount.address })
  //       .then((user) => {
  //         if (user) payload.fromAccount.name = user.name;
  //         else
  //           payload.fromAccount.name = payload.fromAccount.address
  //             .slice(2, 9)
  //             .toUpperCase();
  //         event = new EventModel(payload);
  //         event
  //           .save()
  //           .then(res.status(201).end())
  //           .catch((err) => {
  //             res.status(500).send({ message: err.message });
  //           });
  //       })
  //       .catch((err) => {
  //         res.status(500).send({ message: err.message });
  //       });
  //   } else if (!payload.fromAccount && payload.toAccount) {
  //     UserModel.findOne({ address: payload.toAccount.address })
  //       .then((user) => {
  //         if (user) payload.toAccount.name = user.name;
  //         else
  //           payload.toAccount.name = payload.toAccount.address
  //             .slice(2, 9)
  //             .toUpperCase();
  //         event = new EventModel(payload);
  //         event
  //           .save()
  //           .then(res.status(201).end())
  //           .catch((err) => {
  //             res.status(500).send({ message: err.message });
  //           });
  //       })
  //       .catch((err) => {
  //         res.status(500).send({ message: err.message });
  //       });
  //   }
  // }
};

exports.findMinterByTokenId = (req, res) => {
  const { tokenId } = req.params;
  EventModel.findOne({ tokenId: tokenId, eventType: "Minted" })
    .then((event) => {
      UserModel.findOne({ address: event.toAccount.address })
        .then((user) => {
          res.json(user);
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};
