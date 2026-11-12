const User = require("../models/userModel");
const cookieParser = require("cookie-parser");

const Singup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.Singup(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.Login(email, password);
    const user = await User.findOne({ email }).select("-password");
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }) 

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }}

const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
    Singup,
    Login,
    Logout
   
  }
