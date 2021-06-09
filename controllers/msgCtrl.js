const Message = require("../models/message");
const { getUserId } = require("../utils/jwtUtils");

module.exports = {
  getMessages: (req, res) => {
    Message.find()
      .then((messages) => {
        res.status(200).json(messages);
        return;
      })
      .catch((err) => {
        res.status(500).json({ error: "Unable to get messages: " + err });
        return;
      });
  },
  postMessage: (req, res) => {
    const jwt = req.body.jwt;
    const userId = getUserId(jwt);
    const content = req.body.content;

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
};
