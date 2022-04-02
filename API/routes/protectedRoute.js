const jwt = require("./../utilities/jwt");

const authorize = (req) => {
  let { authorization } = req.headers;
  if (!authorization) {
    return false;
  } else {
    let auth_token = jwt.verify(authorization);
    if (!auth_token) {
      return false;
    }
    return true;
  }
};

module.exports.authorize = authorize;
