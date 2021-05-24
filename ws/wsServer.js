const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {},
});
const axios = require("axios");

const config = require("../config");

io.on("connection", (socket) => {
  socket.on("new_message", (data) => {
    axios
      .post("http://localhost:" + config.ServerPort + "/api/message/post", {
        jwt: data.token,
        content: data.content,
      })
      .then(() => {
        io.sockets.emit("message", {});
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

server.listen(config.WSServerPort, () => {
  console.log("WS server listening on port " + config.WSServerPort);
});
