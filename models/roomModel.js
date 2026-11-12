const mongoose = require("mongoose");


const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        index: true
    },
    userOneID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    userTwoID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    latestMessage:{
        type:  mongoose.Schema.Types.ObjectId,
        index: true,
        ref: 'Massage'
    }

})

const Rooms = mongoose.model("Room",roomSchema);
module.exports = Rooms;
