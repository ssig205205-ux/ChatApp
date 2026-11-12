const mongoose = require("mongoose");

const massageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        index:true,
        required:true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        index:true
    },
    massage:{
        type: String,
        required:true
    }
}, { timestamps: true });


const Massage = mongoose.model("Massage", massageSchema);
module.exports = Massage;