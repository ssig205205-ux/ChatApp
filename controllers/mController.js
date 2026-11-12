const Message = require('../models/massageModel');

const saveMessage = async (senderId, roomId, massage) => {
    try{
        const newMessage = await Message.create({ senderId, roomId, massage });
        return newMessage;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAllMessages = async (req,res) => {
    try{
        const {roomId} = req.params;
        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    saveMessage,
    getAllMessages
}