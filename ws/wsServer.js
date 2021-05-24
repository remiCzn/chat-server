const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const config = require("../config");

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("new_message", () => {
    console.log("good!!");
    socket.emit("message", {});
  });
});

server.listen(config.WSServerPort, () => {
  console.log("WS server listening on port 3000");
});
