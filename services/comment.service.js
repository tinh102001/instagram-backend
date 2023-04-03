import { Posts } from "../models/post.model.js";
import { Comments } from "../models/comment.model.js";

export const commentServices = {
  create: async (userId, postId, content, tag, reply, postUserId) => {
    const newComment = new Comments({
      user: userId,
      content,
      tag,
      reply,
      postUserId,
      postId,
    });

    await Posts.findOneAndUpdate(
      { _id: postId },
      {
        $push: { comments: newComment._id },
      },
      { new: true }
    );

    await newComment.save();
    return newComment;
  },
  update: async (commentId, userId, content) => {
    const updateComment = await Comments.findOneAndUpdate(
      {
        _id: commentId,
        user: userId,
      },
      { content }
    );
    return updateComment;
  },
  delete: async (commentId, userId) => {
    const comment = await Comments.findOneAndDelete({
      _id: commentId,
      $or: [{ user: userId }, { postUserId: userId }],
    });

    await Posts.findOneAndUpdate(
      { _id: comment.postId },
      {
        $pull: { comments: commentId },
      }
    );
    return comment;
  },
  like: async (commentId, userId, res) => {
    const comment = await Comments.find({
      _id: commentId,
      likes: userId,
    });
    if (comment.length > 0) return [comment];

    await Comments.findOneAndUpdate(
      { _id: commentId },
      {
        $push: { likes: userId },
      },
      { new: true }
    );
    return comment;
  },
  unlike: async (commentId, userId) => {
    const comment = await Comments.findOneAndUpdate(
      { _id: commentId },
      {
        $pull: { likes: userId },
      },
      { new: true }
    );
    return comment;
  },
};
