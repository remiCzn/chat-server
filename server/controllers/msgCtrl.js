const Message = require("../models/message");
const o2oConv = require("../models/o2oConversation");
const User = require("../models/user");
const { existConvWith } = require("../utils/conv.utils");
const jwtUtils = require("../utils/jwtUtils");
const { getUserId } = require("../utils/jwtUtils");

module.exports = {
  getMessages: (req, res) => {
    if (!req.params.id) {
      Message.find()
        .then((messages) => {
          res.status(200).json(messages);
          return;
        })
        .catch((err) => {
          res.status(500).json({ error: "Unable to get messages: " + err });
          return;
        });
    } else {
      let headerAuth = req.headers.authorization;
      let userId = jwtUtils.getUserId(headerAuth);

      if ((userId = null)) {
        res.status(400).json({ error: "wrong token" });
      }

      o2oConv.find({ _id: req.params.id }).then((convFound) => {
        if (convFound) {
          if (convFound.user1 == userId || convFound.user2 == userId) {
            res.status(200).json(convFound);
            return;
          } else {
            res.status(400).json({ error: "Access refused to this conv" });
            return;
          }
        } else {
          res.status(400).json({ error: "This conv doesn't exist" });
          return;
        }
      });
    }
  },
  postMessage: (req, res) => {
    const jwt = req.body.jwt;
    const userId = getUserId(jwt);
    const content = req.body.content;
    const toConv = req.body.toConv;

    if (userId == null) {
      res.status(400).json({ error: "User not found" });
    } else if (content == null) {
      res.status(400).json({ error: "Content is empty" });
    } else {
      let newMessage = new Message({
        userId: userId,
        content: content,
      });
      newMessage.save();
      res.status(200).json({
        message: "message sent",
        user: userId,
        content: req.body.content,
        date: new Date(),
      });
    }
  },
  createConv: (req, res) => {
    const jwt = req.body.jwt;
    const toUser = req.body.toUser;
    const firstMessage = req.body.firstMessage;

    //Verify if the friend user exists
    User.find({ _id: toUser }).then((userFound) => {
      if (!userFound) {
        res.status(400).json({ error: "User not found" });
      }
    });
    //verify if the actual user is valid
    const userID = getUserId(jwt);
    if (userID == null) {
      res.status(400).json({ error: "Wrong token" });
    } else {
      //Verif if the conv already exist
      console.log("test1");
      o2oConv
        .find({ user1: userID, user2: toUser })
        .then((convFound) => {
          console.log(convFound);
          if (convFound.length != 0) {
            return true;
          } else {
            return o2oConv
              .find({ user1: toUser, user2: userID })
              .then((convFound) => {
                if (convFound.length != 0) {
                  return true;
                } else {
                  return false;
                }
              });
          }
        })
        .then((hasConv) => {
          console.log(hasConv);
          if (hasConv == true) {
            res.status(400).json({ error: "Conv already exists" });
            return;
          } else if (firstMessage == null) {
            res.status(400).json({ error: "Content is Empty" });
          } else {
            //Create the conv
            let newConv = new o2oConv({
              user1: userID,
              user2: toUser,
            });
            newConv.save((err, conv) => {
              console.log(err);
              console.log(conv);
              res.status(200).json({ response: "Conv created", conv: conv });
            });
          }
        });
    }
  },
};
