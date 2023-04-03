import { Users } from "../models/user.model.js";

export const userServices = {
  search: async (username) => {
    const user = Users.find({
      username: { $regex: username },
    })
      .limit(10)
      .select("fullname username avatar");
    return user;
  },
  get: async (id) => {
    const user = await Users.findById(id)
      .select("-password")
      .populate("followers following", "-password");
    return user;
  },
  update: async (
    id,
    avatar,
    fullname,
    mobile,
    address,
    story,
    website,
    gender
  ) => {
    await Users.findOneAndUpdate(
      { _id: id },
      {
        avatar,
        fullname,
        mobile,
        address,
        story,
        website,
        gender,
      }
    );
    const user = await Users.findById(id);
    return user;
  },
  follow: async (id, userId) => {
    const user = await Users.find({
      _id: id,
      followers: userId,
    });
    if (user.length > 0) return [user];

    const newUser = await Users.findOneAndUpdate(
      { _id: id },
      {
        $push: { followers: userId },
      },
      { new: true }
    ).populate("followers following", "-password");

    await Users.findOneAndUpdate(
      { _id: userId },
      {
        $push: { following: id },
      },
      { new: true }
    );
    return newUser;
  },
  unfollow: async (id, userId) => {
    const newUser = await Users.findOneAndUpdate(
      { _id: id },
      {
        $pull: { followers: userId },
      },
      { new: true }
    ).populate("followers following", "-password");

    await Users.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { following: id },
      },
      { new: true }
    );

    return newUser;
  },
  suggestions: async (user, num) => {
    const newArr = [...user.following, user._id];

    const users = await Users.aggregate([
      { $match: { _id: { $nin: newArr } } },
      { $sample: { size: Number(num) } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "following",
        },
      },
    ]).project("-password");

    return users;
  },
};
