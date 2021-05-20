const server = require('../server');
const io = require('socket.io')(server, {
    cors: {}
});

io.on("connection", (socket) => {
    console.log("user connected")
    socket.emit('welcome', {
        data: "Hello world"
    });
    socket.on("disconnect", ()=> {
        console.log("user disconnected")
    })
});

module.exports = io;