const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModels");
const User = require("../models/userModel");
const { quotelessJson } = require("zod");
const accessChats = asyncHandler(async (req, resp) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("userid cannot get");
    return resp.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    resp.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      resp.status(200).send(fullChat);
    } catch (error) {
      resp.status(400);
      throw new Error("chat error");
    }
  }
});

const fetchChats = asyncHandler(async (req, resp) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        resp.status(200).send(results);
      });
  } catch (error) {
    resp.status(400);
    throw new Error(error.message);
  }
});
const createGroupChats = asyncHandler(async (req, resp) => {
  if (!req.body.users || !req.body.name) { 
    return resp.status(400).send({ message: "please field all the fields" });
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return (
      resp.status(400),
      resp.send("more than 2 users are required to form a group chat")
    );
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    resp.status(200).json(fullGroupChat);
  } catch (error) {
    resp.status(400);
    throw new Error("group" + error.message);
  }
});

const renameGroup = asyncHandler(async (req, resp) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    resp.status(400);
    throw new Error("chat not found");
  } else {
    resp.json(updatedChat);
  }
});
const addtoGroup = asyncHandler(async (req, resp) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(chatId, {
    $push: { users: userId },
  },
{
    new: true
}
)
.populate("users","-password")
.populate("groupAdmin","-password");
if(!added){
    resp.status(400);
    throw new Error("Chat Not found");
}else{
    resp.json(added);
}
});
const removeFromGroup = asyncHandler(async (req, resp) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId, {
      $pull: { users: userId },
    },
  {
      new: true
  }
  )
  .populate("users","-password")
  .populate("groupAdmin","-password");
  if(!removed){
      resp.status(400);
      throw new Error("Chat Not found");
  }else{
      resp.json(removed);
  }
  });
  

module.exports = {
  accessChats,
  fetchChats,
  createGroupChats,
  renameGroup,
  addtoGroup,
  removeFromGroup
};
