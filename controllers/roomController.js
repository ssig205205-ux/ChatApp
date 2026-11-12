const Room = require("../models/roomModel");
const User = require("../models/userModel");
const Groups = require("../models/groupChatModel");

const findRooms = async (req, res) => {
  const { userId } = req.body;
  try {
    const rooms = await Room.find({
      $or: [{ userOneID: userId }, { userTwoID: userId }],
    }).populate("latestMessage");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createRoom = async (req, res) => {
  const { userOneID, userTwoID } = req.body;
  if (userOneID === userTwoID) {
    throw new Error("you can not create room with youself ");
  }
  const userOne = await User.findById(userOneID);
  const userTwo = await User.findById(userTwoID);
  const RoomName = `${userOne.name}&${userTwo.name}`;
  const RoomName2 = `${userTwo.name}&${userOne.name}`;
  const existingRoom = await Room.findOne({
    $or: [{ roomName: RoomName }, { roomName: RoomName2 }],
  });
  if (existingRoom) {
    return res.status(400).json({ message: "Room already exists" });
  }
  try {
    const room = await Room.create({
      userOneID,
      userTwoID,
      roomName: RoomName,
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const findUser = async (req, res) => {
  const { email } = req.body;
  const { userId, name } = req.user;

  try {
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const findedUser = user._id;
    if (findedUser.toString() === userId) {
      return res
        .status(422)
        .json({ message: "you cannot enter your own email" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createGroup = async (req, res) => {
  console.log(req.body);
  const { roomName, members } = req.body;
  const memberList = [];
  if (!roomName && !members) {
    throw new Error("data needed");
  }
  for (let i = 0; i < members.length; i++) {
    memberList.push({ userID: members[i] });
  }

  try {
    const createGroup = await Groups.create({
      roomName,
      member: [...memberList],
    });
    res.status(201).json(createGroup);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const findGroups = async (req, res) => {
  const { userId } = req.user;
  if (!userId) {
    throw new Error("roomId is required");
  }
  try {
    const groups = await Groups.find({
      "member.userID": userId,
    }).populate("latestMessage");
    res.status(201).json(groups);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const GroupMemberUpdate = async (req, res) => {
  const { groupId, userId } = req.body;

  if (!groupId || !userId) {
    throw new Error("groupId and userId are required");
  }
  const user = await User.findById(userId);
  const group = await Groups.findById(groupId);

  if (!user || !group) {
    throw new Error("User or group not found");
  }
  try {
    const updateGroup = await Groups.findByIdAndUpdate(
      groupId,
      {
        $addToSet: {
          member: {
            userID: userId,
          },
        },
      },
      { returnDocument: "after" },
    );
    res.status(201).json(updateGroup);
  } catch (error) {
    console.log(error);
  }
};
const removeGroupMember = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.user;
  if (!groupId) {
    throw new Error("groupId is are required");
  }
  const user = await User.findById(userId);
  const group = await Groups.findById(groupId);

  if (!user || !group) {
    throw new Error("User or group not found");
  }
  try {
    const updatedGroup = await Groups.findByIdAndUpdate(
      groupId,
      {
        $pull: {
          member: {
            userID: userId,
          },
        },
      },
      {
        returnDocument: "after",
      },
    );

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const groupMember = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Groups.findById(groupId).populate({
      path: "member.userID",
      select: "-password",
    });

    if (!group) {
      throw new Error("room is not exist or id is wrong");
    }
    const { member } = group;
    res.status(200).json(member);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

const Me = async (req, res) => {
  const { userId, name } = req.user;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ user });
};

const friendList = async (req, res) => {
  const { userId } = req.user;
  try {
    const rooms = await Room.find({
      $or: [{ userOneID: userId }, { userTwoID: userId }],
    });
    const friendIds = rooms.map((room) =>
      room.userOneID.toString() === userId ? room.userTwoID : room.userOneID,
    );
    const friends = await User.find({
      _id: { $in: friendIds },
    }).select("-password");

    res.status(200).json(friends);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const deletedRoom = await Room.findByIdAndDelete(roomId);
    res.status(200).json(deletedRoom);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = {
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
  deleteRoom,

};
