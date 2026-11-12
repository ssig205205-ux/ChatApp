const {saveMassages,getAllMessages} = require('../controllers/mController');
const express = require("express");
const mRouter = express.Router();

mRouter.get("/getMessages/:roomId", getAllMessages);

module.exports = mRouter;