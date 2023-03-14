import { Posts } from "../models/post.model.js";
import { Users } from "../models/user.model.js";
import { Comments } from "../models/comment.model.js";

export const postServices = {
  create: async (content, images, userId) => {
    const newPost = new Posts({
      content: content,
      images: images,
      user: userId,
    });
    await newPost.save();
    return newPost;
  },
  update: async (content, images, postId) => {
    await Posts.findOneAndUpdate(
      { _id: postId },
      {
        content: content,
        images: images,
      }
    )
      .populate("user")
      .populate("comments");
  },
  delete: async (postId, userId) => {
    const deletePost = await Posts.findOneAndDelete({
      _id: postId,
      user: userId,
    });
    await Comments.deleteMany({ _id: { $in: post.comments } });
    return deletePost;
  },
  posts: async () => {},
  post: async () => {},
  userPosts: async () => {},
  explorePosts: async () => {},
  like: async () => {},
  unlike: async () => {},
  saved: async (userId, idSavedPost) => {
    try {
      const user = await Users.find({
        _id: userId,
        saved: idSavedPost,
      });
      if (user.length > 0)
        return res.status(400).json({ msg: "Bạn đã lưu bài viết." });

      const save = await Users.findOneAndUpdate(
        { _id: userId },
        {
          $push: { saved: idSavedPost },
        },
        { new: true }
      );
      if (!save)
        return res.status(400).json({ msg: "Người dùng không tồn tại." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unSaved: async (userId, idSavedPost) => {
    try {
      const save = await Users.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { saved: idSavedPost },
        },
        { new: true }
      );

      if (!save)
        return res.status(400).json({ msg: "Người dùng không tồn tại." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  savedPosts: async () => {},
};
