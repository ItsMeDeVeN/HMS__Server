const jwt = require("jsonwebtoken");

const generateToken = (userId, userName) => {
  return jwt.sign({ userId, userName }, "secretKey", { expiresIn: "1h" });
};
module.exports = { generateToken };
