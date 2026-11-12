const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const cookieParser = require("cookie-parser");


dotenv.config();
async function authMiddleWare(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
  //const token = auth.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.id;
    const { name} = await User.findById(userId);
    req.user = {userId, name };
    console.log(userId, name);
 
    console.log("user is authorized");
    next();
  } catch (error) {
    return res.status(401).json({ message: "User is not authorized" });
  }
}

module.exports = authMiddleWare;