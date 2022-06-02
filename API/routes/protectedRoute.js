const jwtUtils = require("./../utilities/jwt");
const jwt = require("jsonwebtoken");

const authorize = (req, userId, token) => {
  let { authorization } = req.headers;
  if (!authorization) {
    return false;
  } else {
    let auth_token = jwtUtils.verify(authorization);
    if (!auth_token) {
      return false;
    }
    if (userId) {
      let jwtData = jwt.decode(token);
      if (jwtData.uid !== userId) {
        return false;
      }
    }
    return true;
  }
};

module.exports.authorize = authorize;
