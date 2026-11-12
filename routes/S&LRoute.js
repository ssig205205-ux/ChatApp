const {Singup,Login,Logout} = require("../controllers/L&SController");
const express = require("express");
const router = express.Router();

router.post("/signup",Singup);
router.post("/login",Login);
router.post("/logout",Logout);



module.exports = router;
