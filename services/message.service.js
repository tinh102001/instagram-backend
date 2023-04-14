import { Conversations } from "../models/conversation.model.js";
import { Messages } from "../models/message.model.js";
import cloudinaryProvider from "../utils/cloudinary.js";

export const messageServices = {
  create: async (sender, recipient, text, media, call) => {
    const newConversation = await Conversations.findOneAndUpdate(
      {
        $or: [
          { recipients: [sender, recipient] },
          { recipients: [recipient, sender] },
        ],
      },
      {
        recipients: [sender, recipient],
        text: text,
        media: media,
        call: call,
      },
      { new: true, upsert: true }
    );

    const newMessage = new Messages({
      conversation: newConversation._id,
      sender: sender,
      call: call,
      recipient: recipient,
      text: text,
      media: media,
    });

    await newMessage.save();
  },
  getConversations: async (userId, skip, limit) => {
    const conversations = await Conversations.find({
      recipients: userId,
    })
      .skip(skip)
      .limit(limit)
      .sort("-updatedAt")
      .populate("recipients", "avatar username fullname");
    return conversations;
  },
  getMessages: async (userId, recipientId, skip, limit) => {
    const messages = await Messages.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    })
      .limit(limit)
      .skip(skip)
      .sort("-createdAt");
      return messages;
  },
  deleteMessages: async (recipientId, senderId) => {
    const message = await Messages.findOneAndDelete({
      _id: recipientId,
      sender: senderId,
    });

    message.media.forEach((img) => {
      if (img.url.includes("image"))
        cloudinaryProvider.uploader.destroy(img.public_id);
      else
        cloudinaryProvider.uploader.destroy(img.public_id, {
          resource_type: "video",
        });
    });
  },
  deleteConversation: async (senderId, recipientId) => {
    const newConver = await Conversations.findOneAndDelete({
      $or: [
        { recipients: [senderId, recipientId] },
        { recipients: [recipientId, senderId] },
      ],
    });
    await Messages.deleteMany({ conversation: newConver._id });
  },
};
