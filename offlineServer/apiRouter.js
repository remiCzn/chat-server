const express = require("express");

exports.router = (function() {
    var apiRouter = express.Router();

    apiRouter.route("/").get((req,res) => {
        res.status(200).json({msg : "Vous etes connectes a l'api"})
    })

    return apiRouter;
})();