let multer = require("multer");
let mongoose = require("mongoose");

const DIR = "../public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed"));
    }
  },
});

let UserFile = require("../models/userfile");

module.exports.upload = upload;

module.exports.sendFile = (req, res, next) => {
  const reqFiles = [];
  const url = req.protocol + "://" + req.get("host");
  for (let i = 0; i < req.files.length; i++) {
    reqFiles.push(url + "/public/" + req.files[i].filename);
  }

  const userFile = new UserFile({
    _id: new mongoose.Types.ObjectId(),
    avatar: reqFiles,
  });
  userFile
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Done upload!",
        userFileCreated: {
          _id: result._id,
          avatar: result.avatar,
        },
      });
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err,
        });
    });
};

module.exports.getFile = (req, res, next) => {
  UserFile.find().then((data) => {
    res.status(200).json({
      message: "User list retrieved",
      users: data,
    });
  });
};
