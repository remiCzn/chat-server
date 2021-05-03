var express = require("express");
const mainCtrl = require("./controllers/mainCtrl");
const userCtrl = require("./controllers/userCtrl");

exports.router = (function () {
  var apiRouter = express.Router();

  //Put the routes here
  apiRouter.route("/").get(mainCtrl.main);

  apiRouter.route("/user/register").post(userCtrl.register);
  apiRouter.route("/user/login").post(userCtrl.login);
  apiRouter.route("/user/me").get(userCtrl.getUserInfo);
  return apiRouter;
})();
