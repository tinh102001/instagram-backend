import { Notifies } from "../models/notify.model.js";

export const notifyServices = {
  create: async (id, recipients, url, text, content, image, userId) => {
    const notify = new Notifies({
      id,
      recipients,
      url,
      text,
      content,
      image,
      user: userId,
    });

    await notify.save();
    return notify;
  },
  get: async (userId) => {
    const notifies = await Notifies.find({ recipients: userId })
        .sort("-createdAt")
        .populate("user", "avatar username");
    return notifies
  },
  remove: async (id, url) => {
    const notify = await Notifies.findOneAndDelete({
      id: id,
      url: url,
    });
    return notify;
  },
  isRead: async (id) => {
    const notifies = await Notifies.findOneAndUpdate(
      { _id: id },
      {
        isRead: true,
      }
    );
    return notifies;
  },
  deleteAll: async (userId) => {
    const notifies = await Notifies.deleteMany({ recipients: userId });
    return notifies;
  },
};
