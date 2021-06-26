const Message = require("../models/message");
const o2oConv = require("../models/o2oConversation");
const User = require("../models/user");
const jwtUtils = require("../utils/jwtUtils");
const { getUserId } = require("../utils/jwtUtils");

module.exports = {
  getMessages: (req, res) => {
    Message.find({ convId: null })
      .then((messages) => {
        res.status(200).json(messages);
        return;
      })
      .catch((err) => {
        res.status(500).json({ error: "Unable to get messages: " + err });
        return;
      });
  },
  getMessagesFromConv: (req, res) => {
    let convId = req.params.convId;
    let userId = jwtUtils.getUserId(req.headers.authorization);

    if (userId == null) {
      return res.status(400).json({ error: "wrong token" });
    }

    o2oConv.findOne({ _id: convId }).then((convFound) => {
      if (convFound) {
        if (convFound.user1 == userId || convFound.user2 == userId) {
          console.log(convFound.id);
          Message.find({ convId: convFound._id }).then((msgList) => {
            res.status(200).json(msgList);
            return;
          });
        } else {
          res.status(400).json({ error: "Access refused to this conv" });
          return;
        }
      } else {
        res.status(400).json({ error: "This conv doesn't exist" });
        return;
      }
    });
  },
  postMessage: (req, res) => {
    const jwt = req.body.jwt;
    const userId = getUserId(jwt);
    const content = req.body.content;
    const toConv = req.body.toConv;
    if (userId == null) {
      res.status(400).json({ error: "Wrong token" });
      return;
    }
    if (toConv == null) {
      if (content == null) {
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
    } else {
      o2oConv.findOne({ _id: toConv }).then((convFound) => {
        if (convFound.user1 == userId || convFound.user2 == userId) {
          if (content == null) {
            res.status(400).json({ error: "Content is empty" });
            return;
          } else {
            let newMessage = new Message({
              userId: userId,
              content: content,
              convId: toConv,
            });
            newMessage.save();
            res.status(200).json({
              message: "message sent",
              user: userId,
              content: req.body.content,
              convId: toConv,
              date: new Date(),
            });
            return;
          }
        } else {
          res.status(401).json({
            error:
              "Your are not allowed to send a message in this conversation",
          });
          return;
        }
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
