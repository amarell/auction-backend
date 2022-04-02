const jwt = require("jsonwebtoken");

class JWT {
  static sign(user) {
    return jwt.sign(
      {
        uid: user._id,
        role: user.role,
      },
      process.env.JWT_KEY
    );
  }

  static verify(token) {
    return jwt.verify(token, process.env.JWT_KEY);
  }
}

module.exports = JWT;
