import { Messages } from "../models/message.model.js";
import { Conversations } from "../models/conversation.model.js";
import { messageServices } from "../services/message.service.js";

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export const messageController = {
  createMessage: async (req, res) => {
    try {
      const { sender, recipient, text, media, call } = req.body;

      if (!recipient || (!text.trim() && media.length === 0 && !call)) return;

      await messageServices.create(sender, recipient, text, media, call);

      res.json({ msg: "Tạo tin nhắn thành công!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getConversations: async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 9;
      const skip = (page - 1) * limit;

      const conversations = await messageServices.getConversations(
        req.user._id,
        skip,
        limit
      );

      res.json({
        conversations,
        result: conversations.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getMessages: async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 9;
      const skip = (page - 1) * limit;

      const messages = await messageServices.getMessages(
        req.user._id,
        req.params.id,
        skip,
        limit
      );

      res.json({
        messages,
        result: messages.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteMessages: async (req, res) => {
    try {
      await messageServices.deleteMessages(req.params.id, req.user._id);

      res.json({ msg: "Xóa tin nhắn thành công!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteConversation: async (req, res) => {
    try {
      await messageServices.deleteConversation(req.user._id, req.params.id);

      res.json({ msg: "Xóa hội thoại thành công!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
