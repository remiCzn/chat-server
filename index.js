const { Worker } = require('worker_threads');

let rest = new Worker("./server/index.js")
let ws = new Worker("./chat-ws-server/wsServer.js");