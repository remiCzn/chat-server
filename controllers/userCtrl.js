const bcrypt = require("bcrypt");
const User = require("../models/user");
const asyncLib = require("async");
const jwtUtils = require("../utils/jwtUtils");

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PW_REGEX = /^(?=.*\d).{6,15}$/;

module.exports = {
  register: function (req, res) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.pw;
    const mood = req.body.mood;

    if (email == null || username == null || password == null) {
      res.status(400).json({ error: "Missing parameters" });
      return;
    } else if (username.length >= 25 || username.length <= 4) {
      res.status(400).json({ error: "Wrong username: must be length 5-24" });
      return;
    } else if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: "Email not valid" });
      return;
    } else if (!PW_REGEX.test(password)) {
      res.status(400).json({
        error:
          "Password not valid (must be length 6-15, and include at least 1 number",
      });
      return;
    }
    asyncLib.waterfall([
      (done) => {
        User.findOne({ email: email })
          .then((userFound) => {
            if (userFound) {
              res.status(400).json({ error: "user already exist" });
              return;
            } else {
              done(null, userFound);
            }
          })
          .catch((err) => {
            res.status(500).json({
              error: "Internal error occured: unable to verify user",
            });
          });
      },
      (userFound, done) => {
        bcrypt.hash(password, 5, function (err, cryptedPassword) {
          if (err) {
            res.status(500).json({ error: "unable to create new user" });
            return;
          }
          let newUser = new User({
            email: email,
            username: username,
            password: cryptedPassword,
            mood: mood,
            isAdmin: false,
          });
          newUser.save();
          res.status(200).json({ response: "user created" });
        });
      },
    ]);
  },
  login: function (req, res) {
    const email = req.body.email;
    const password = req.body.pw;

    if (email == null || password == null) {
      res.status(400).json({ error: "Missing parameters" });
      return;
    }

    asyncLib.waterfall([
      (done) => {
        User.findOne({ email: email })
          .then((userFound) => {
            done(null, userFound);
          })
          .catch((err) => {
            res.status(500).json({ error: "Unable to veriy user" });
          });
      },
      (userFound, done) => {
        if (!userFound) {
          res.status(500).json({ error: "User not found" });
        } else {
          bcrypt.compare(password, userFound.password, (err, verified) => {
            if (err) {
              res.status(500).json({ error: "An internal error occured" });
              return;
            } else if (verified) {
              res
                .status(200)
                .json({ token: jwtUtils.generateToken(userFound) });
              return;
            } else {
              res.status(400).json({ error: "Password wrong" });
            }
          });
        }
      },
    ]);
  },
  getUserInfo: (req, res) => {
    let headerAuth = req.headers.authorization;
    let userId = jwtUtils.getUserId(headerAuth);

    if (userId == null) {
      return res.status(400).json({ error: "wrong token" });
    }

    User.findOne({ _id: userId })
      .then((userFound) => {
        if (userFound) {
          res.status("200").json({
            email: userFound.email,
            username: userFound.username,
            mood: userFound.mood,
            isAdmin: userFound.isAdmin,
          });
          return;
        } else {
          res.status(400).json({ error: "User not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: "Cannot get user infos: internal error occured",
        });
      });
  },
  getAllUsers: (req, res) => {
    User.find()
      .then((users) => {
        res.status(200).json(users.map((user) => user._id));
        return;
      })
      .catch((err) => {
        res.status(500).json({ error: "Unable to get users:" + err });
        return;
      });
  },
  getUserbyId: (req, res) => {
    User.findOne({ _id: req.params.id })
      .then((user) => {
        res.status(200).json({
          username: user.username,
        });
        return;
      })
      .catch((err) => {
        res.status(500).json({ error: "Unable to get user: " + err });
        return;
      });
  },
};
