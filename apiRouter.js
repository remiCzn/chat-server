var express = require("express");
const mainCtrl = require("./controllers/mainCtrl");

exports.router = (function () {
  var apiRouter = express.Router();

  apiRouter.route("/").get(mainCtrl);

  //Put the routes here

  return apiRouter;
})();
