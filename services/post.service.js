import { Posts } from "../models/post.model.js";
import { Users } from "../models/user.model.js";
import { Comments } from "../models/comment.model.js";
import cloudinaryProvider from "../utils/cloudinary.js";

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
    const updatePost = await Posts.findOneAndUpdate(
      { _id: postId },
      {
        content: content,
        images: images,
      }
    )
      .populate("user")
      .populate("comments");
    return updatePost;
  },
  delete: async (postId, userId) => {
    const deletePost = await Posts.findOneAndDelete({
      _id: postId,
      user: userId,
    });
    deletePost.images.forEach((img) => {
      if(img.url.includes("image"))
        cloudinaryProvider.uploader.destroy(img.public_id);
      else 
        cloudinaryProvider.uploader.destroy(img.public_id, { resource_type: "video" });
    });

    await Comments.deleteMany({ _id: { $in: deletePost.comments } });
    return deletePost;
  },
  posts: async (userFollowing, userId, skip, limit) => {
    const posts = await Posts.find({
      user: [...userFollowing, userId],
    })
      .skip(skip)
      .limit(limit)
      .sort("-updatedAt")
      .populate("user likes", "avatar username fullname followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });
    return posts;
  },
  post: async (postId) => {
    const post = await Posts.findById(postId)
      .populate("user likes", "avatar username fullname followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });
    return post;
  },
  userPosts: async (userId, skip, limit) => {
    const posts = await Posts.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .sort("-createdAt");
    return posts;
  },
  explorePosts: async (newPosts, num) => {
    const posts = await Posts.aggregate([
      { $match: { user: { $nin: newPosts } } },
      { $sample: { size: Number(num) } },
    ]);
    return posts;
  },
  like: async (postId, userId) => {
    const post = await Posts.find({
      _id: postId,
      likes: userId,
    });
    if (post.length > 0) return [post];

    const like = await Posts.findOneAndUpdate(
      { _id: postId },
      {
        $push: { likes: userId },
      },
      { new: true }
    );
    return [post, like];
  },
  unlike: async (postId, userId) => {
    const like = await Posts.findOneAndUpdate(
      { _id: postId },
      {
        $pull: { likes: userId },
      },
      { new: true }
    );
    return like;
  },
  saved: async (userId, idSavedPost) => {
    const user = await Users.find({
      _id: userId,
      saved: idSavedPost,
    });
    if (user.length > 0) {
      return [user];
    }
    const save = await Users.findOneAndUpdate(
      { _id: userId },
      {
        $push: { saved: idSavedPost },
      },
      { new: true }
    );
    return [user, save];
  },
  unSaved: async (userId, idSavedPost) => {
    const save = await Users.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { saved: idSavedPost },
      },
      { new: true }
    );
    return save;
  },
  savedPosts: async (userSavedPost, skip, limit) => {
    const savePosts = await Posts.find({
      _id: { $in: userSavedPost },
    })
      .skip(skip)
      .limit(limit)
      .sort("-createdAt");
    return savePosts;
  },
  getTotalPosts: async (userFollowing, userId) => {
    const totalPosts = await Posts.find({
      user: [...userFollowing, userId],
    }).count();
    return totalPosts;
  },
  getTotalUserPosts: async (userId) => {
    const totalUserPosts = await Posts.find({
      user: [userId],
    }).count();
    return totalUserPosts;
  },
  getTotalSavedPosts: async (userSavedPost) => {
    const totalSavedPosts = await Posts.find({
      _id: { $in: userSavedPost },
    }).count();
    return totalSavedPosts;
  },
};
