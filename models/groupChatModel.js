const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    index: true,
  },
  member: [
    {
      _id: false,
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    ref: "Massage",
   
  },
});

const Groups = mongoose.model("Group", groupSchema);
module.exports = Groups;
