const {
    createRoom,
    findUser,
    findRooms,
    Me,
    createGroup,
    findGroups,
    friendList,
    GroupMemberUpdate,
    removeGroupMember,
    groupMember,
    deleteRoom

} = require('../controllers/roomController');    
const express = require("express");
const roomRouter = express.Router();

roomRouter.post("/createRoom", createRoom);
roomRouter.post("/findUser", findUser);
roomRouter.post("/findRooms", findRooms);
roomRouter.get("/me", Me);
roomRouter.post("/createGroup",createGroup);
roomRouter.get("/findGroups", findGroups);
roomRouter.get("/findFriends", friendList);
roomRouter.patch("/updateGroup", GroupMemberUpdate);
roomRouter.delete("/removeMember/:groupId", removeGroupMember);
roomRouter.get("/groupMember/:groupId",  groupMember)
roomRouter.delete("/deleteRoom/:roomId",deleteRoom)
module.exports = roomRouter;   