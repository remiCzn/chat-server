const mongoose = require("mongoose");
const Message = require("../models/message");
const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = {
  main: function (req, res) {
    return res.status(200).json({
      title: "Chat server",
      gitRepo: "https://github.com/remiCzn/chat-server.git",
      version: "1.0.0",
      created: "2 May 2021",
    });
  },
  cleardb: function (req, res) {
    Message.deleteMany({}).then(() => {
      User.deleteMany({})
        .then(() => {
          bcrypt.hash("12345", 5, function (err, cryptedPassword) {
            if (err) {
              res.status(500).json({ error: "unable to clear db" });
              return;
            }
            let newUser = new User({
              email: "remiCzn@github.com",
              username: "remiCzn",
              password: cryptedPassword,
              mood: "Hello world!",
              isAdmin: false,
            });
            newUser.save();
          });
        })
        .then(() => {
          res.status(200).json({ message: "Clear db success" });
        });
    });
  },
};
