var express = require("express");
const mainCtrl = require("./controllers/mainCtrl");
const userCtrl = require("./controllers/userCtrl");
const msgCtrl = require("./controllers/msgCtrl");

exports.router = (function () {
  var apiRouter = express.Router();

  //Put the routes here
  apiRouter.route("/").get(mainCtrl.main);

  apiRouter.route("/user/register").post(userCtrl.register);
  apiRouter.route("/user/login").post(userCtrl.login);
  apiRouter.route("/user/me").get(userCtrl.getUserInfo);
  apiRouter.route("/user/all").get(userCtrl.getAllUsers);

  apiRouter.route("/message/getAll").get(msgCtrl.getMessages);
  apiRouter.route("/message/post").post(msgCtrl.postMessage);
  return apiRouter;
})();
