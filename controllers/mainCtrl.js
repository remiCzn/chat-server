module.exports = function (req, res) {
  return res.status(200).json({
    title: "Chat server",
    gitRepo: "https://github.com/remiCzn/chat-server.git",
    version: "1.0.0",
    created: "2 May 2021",
  });
};
