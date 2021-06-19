//Connexion à la base de données
const mongoose = require("mongoose");
const config = require("./config.js");

const configDB = {
  username: config.dbUsername,
  dbname: config.dbname,
  password: config.dbPassword,
};
mongoose
  .connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Création de l'application express
const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./apiRouter").router;

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/", apiRouter);

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.status(200).end("Vous etes connectes au serveur");
});

module.exports = app;
