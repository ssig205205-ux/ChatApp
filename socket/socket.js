const User = require("../models/userModel");
const Room = require("../models/roomModel");
const Massage = require("../models/massageModel");
const Groups = require("../models/groupChatModel");

const onlineUsers = [];
module.exports = (io) => {
  //online check
  io.on("connection", async (socket) => {
    console.log("a user connected", socket.id);
    const friend = [];

    const userID = socket.user.userId;
    socket.join(userID.toString());
    if (!onlineUsers.includes(userID.toString())) {
      onlineUsers.push(userID.toString());
    }

    console.log("onlineUsers", onlineUsers);

    const roomlist = await Room.find({
      $or: [{ userOneID: userID }, { userTwoID: userID }],
    });
    const array = [...roomlist];
    array.forEach((e) => {
      if (e.userOneID.toString() === userID.toString()) {
        friend.push(e.userTwoID.toString());
        console.log(e.userOneID);
      } else {
        friend.push(e.userOneID.toString());
        console.log(e.userTwoID.toString());
      }
    });
    io.to(friend).emit("onlineStatus", {
      userID,
      status: true,
    });

    console.log(friend);
    //_______________________________________

    //join room event
    socket.on("joinRoom", async (roomId) => {
      const room = await Room.findById(roomId);

      console.log("roomId", roomId);
      try {
        const room = await Room.findById(roomId);
        const group = await Groups.findById(roomId);

        if (!room && !group) {
          console.log(`No room or group found with ID ${roomId}.`);
          throw new Error("Room or group not found");
        }

        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      } catch (error) {
        console.log(error);
      }
    });
    //need group join methods

    //send message event
    socket.on("send-message", async (data) => {
      const { roomId, senderId, message } = data;
      if (!roomId || !senderId || !message) {
        console.log("Invalid message data:", data);
        return;
      }
      console.log(
        `User ${senderId} sent message to room ${roomId}: ${message}`,
      );
      const massage = await Massage.create({
        senderId,
        roomId,
        massage: message,
      });
      io.to(roomId).emit("receive-message", {
        senderId,
        massage: message,
        roomId,
      });

      //need update for group chat
      //use if else
      console.log(`Message sent to room ${roomId}:`, massage._id);
      const room = await Room.findById(roomId);
      const group = await Groups.findById(roomId);

      if (room) {
        const rooms = await Room.findByIdAndUpdate(
          roomId,
          { latestMessage: massage._id },
          { new: true },
        );

        const updatedRoom =
          await Room.findById(roomId).populate("latestMessage");

        if (!rooms) return;
        console.log("emmit to:", rooms.userOneID, rooms.userTwoID);
        console.log(`Updated latest message for room ${roomId}:`, updatedRoom);
        io.to(rooms.userOneID.toString()).emit("room-update", updatedRoom);
        io.to(rooms.userTwoID.toString()).emit("room-update", updatedRoom);
      }
      if (group) {
        const groups = await Groups.findByIdAndUpdate(
          roomId,
          { latestMessage: massage._id },
          { new: true },
        );
        const updatedGroup =
          await Groups.findById(roomId).populate("latestMessage");

        const memberList = updatedGroup.member;
        console.log(memberList);

        if (!groups) return;
        console.log("emmit to:", updatedGroup);
        for(let i=0;i<memberList.length;i++){
            console.log(memberList[i].userID);
            io.to(memberList[i].userID).emit("group-update", updatedGroup);
        }
      }
    });

    //________________________________________________________________

    //online Check again

    socket.on("isUserOnline", async () => {
      const onlinefriend = [];
      console.log("friend", friend);
      console.log("onlineUsers", onlineUsers);
      for (let i = 0; i < friend.length; i++) {
        if (onlineUsers.includes(friend[i])) {
          onlinefriend.push(friend[i]);
        }
      }
      if (onlinefriend.length > 0) {
        console.log("onlinefriend", onlinefriend);
      } else {
        console.log(null);
      }

      const modifiedArray = [];
      onlinefriend.forEach((e) => {
        modifiedArray.push({ userID: e, status: true });
      });
      console.log(modifiedArray);

      io.to(userID.toString()).emit("sendOnlinedUsers", modifiedArray);
    });

    //_________________________________________________________

    //diconnecting

    socket.on("disconnecting", async () => {
      const indexOfUser = onlineUsers.indexOf(userID.toString());
      console.log("index", indexOfUser);
      onlineUsers.splice(indexOfUser, 1);
      console.log(onlineUsers);

      io.to(friend).emit("statusOffline", userID.toString());
    });

    //disconnect event
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};
