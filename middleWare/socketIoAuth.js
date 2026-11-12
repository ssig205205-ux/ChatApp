const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function socketAuth(socket, next) {
  try {
    const cookie = socket.handshake.headers.cookie;
    console.log("Cookie from socket handshake:", cookie);


    const token = cookie
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return next(new Error("Token is required"));
    }
    console.log(token);

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id);

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = {
      userId: user._id,
      name: user.name,
    };

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
}

module.exports = socketAuth;
