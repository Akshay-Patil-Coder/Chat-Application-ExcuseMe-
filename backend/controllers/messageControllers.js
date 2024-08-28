const asyncHandler = require("express-async-handler");
const Message = require('../models/messageModel');
const User = require("../models/userModel");
const Chat = require("../models/chatModels");

const sendMessage = asyncHandler(async (req, resp) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return resp.sendStatus(400);
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        });

        resp.json(message);
    } catch (error) {
        resp.status(400).json({ error: error.message });
    }
});
const allMessage = asyncHandler(async(req,resp)=>{
try {
    const messages= await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")
    resp.json(messages)
    
} catch (error) {
    resp.status(400).json({ error: error.message });
    
}
});
module.exports = { sendMessage,allMessage };
