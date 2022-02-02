const res = require("express/lib/response");
const UserModel = require("../models/user.model");
const sendEmail = require("../templates/email.send");
const templates = require("../templates/email.templates");

const msgs = {
  confirm: "Email sent, please check your inbox to confirm",
  confirmed: "confirmed",
  resend: "Confirmation email resent, maybe check your spam?",
  couldNotFind: "couldNotFind",
  alreadyConfirmed: "alreadyConfirmed",
};

exports.collectEmail = (req, res) => {
  const { address, name, email } = req.body;

  UserModel.findOne({ address })
    .then((user) => {
      // We have a new user! Send them a confirmation email.
      if (!user) {
        UserModel.create({ address, name, email })
          .then((newUser) =>
            sendEmail(newUser.email, templates.confirm(newUser._id))
          )
          .then(() => res.json({ msg: msgs.confirm }))
          .catch((err) => console.log(err));
      } else if (user && !user.email) {
        UserModel.findOneAndUpdate(
          { address: address },
          {
            $set: {
              name: name,
              email: email,
              verify: false,
            },
          }
        )
          .then((user) => {
            sendEmail(user.email, templates.confirm(user._id));
            res.json({ msg: msgs.confirm });
          })
          .catch((e) => {
            res.status(500).send({ message: e.message });
          });
      }
      // We have already seen this email address. But the user has not
      // clicked on the confirmation link. Send another confirmation email.
      else if (user && !user.verify) {
        sendEmail(user.email, templates.confirm(user._id)).then(() =>
          res.json({ msg: msgs.resend })
        );
      }

      // The user has already confirmed this email address
      else {
        res.json({ msg: msgs.alreadyConfirmed });
      }
    })
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};

exports.updateEmail = (req, res) => {
  const payload = req.body;

  UserModel.findOneAndUpdate(
    { address: payload.address },
    {
      $set: {
        name: payload.name,
        email: payload.email,
        verify: false,
      },
    }
  )
    .then((user) => {
      sendEmail(payload.email, templates.confirm(user._id));
      res.json({ msg: msgs.confirm });
    })
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};

// The callback that is invoked when the user visits the confirmation
// url on the client and a fetch request is sent in componentDidMount.
exports.confirmEmail = (req, res) => {
  const { id } = req.params;

  UserModel.findById(id)
    .then((user) => {
      // A user with that id does not exist in the DB. Perhaps some tricky
      // user tried to go to a different url than the one provided in the
      // confirmation email.
      if (!user) {
        res.json({ msg: msgs.couldNotFind });
      }

      // The user exists but has not been confirmed. We need to confirm this
      // user and let them know their email address has been confirmed.
      else if (user && !user.confirmed) {
        UserModel.findByIdAndUpdate(id, { verify: true })
          .then(() => res.json({ msg: msgs.confirmed }))
          .catch((e) => {
            res.status(500).send({ message: e.message });
          });
      }

      // The user has already confirmed this email address.
      else {
        res.json({ msg: msgs.alreadyConfirmed });
      }
    })
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};
