var express = require("express");
const mainCtrl = require("./controllers/mainCtrl");
const userCtrl = require("./controllers/userCtrl");
const msgCtrl = require("./controllers/msgCtrl");

exports.router = (function () {
  var apiRouter = express.Router();

  //Put the routes here
  apiRouter.route("/").get(mainCtrl.main);
  apiRouter.route("/cleardb").get(mainCtrl.cleardb);

  apiRouter.route("/user/register").post(userCtrl.register);
  apiRouter.route("/user/login").post(userCtrl.login);
  apiRouter.route("/user/me").get(userCtrl.getUserInfo);
  apiRouter.route("/user/byId/:id").get(userCtrl.getUserbyId);
  apiRouter.route("/user/all").get(userCtrl.getAllUsers);
  apiRouter.route("/user/setUsername").put(userCtrl.updateUsername);

  // This route have to be deleted in the future (because display all messages)
  apiRouter.route("/message/get").get(msgCtrl.getMessages);
  apiRouter.route("/message/get/:convId").get(msgCtrl.getMessagesFromConv);
  apiRouter.route("/message/post").post(msgCtrl.postMessage);
  apiRouter.route("/message/newConv").post(msgCtrl.createConv);
  return apiRouter;
})();
