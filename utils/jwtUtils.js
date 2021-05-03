const jwt = require("jsonwebtoken");
const config = require("../config");

const JWT_SIGN_SECRET = config.JWT_SIGN_SECRET;

module.exports = {
  generateToken: (userData) => {
    let token = jwt.sign(
      {
        userId: userData.id,
        isAdmin: userData.isAdmin,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return token;
  },
  getUserId: (authorization) => {
    let userId = null;
    let token = authorization != null ? authorization : token;
    if (token != null) {
      try {
        let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if (jwtToken != null) userId = jwtToken.userId;
      } catch (err) {}
    }
    return userId;
  },
};
