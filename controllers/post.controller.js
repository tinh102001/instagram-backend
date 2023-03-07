import { Posts } from "../models/post.model.js";
import { Users } from "../models/user.model.js";
import { Comments } from "../models/comment.model.js";

const DEFAULT_LIMIT_POST = 6;

export const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;

      if (images.length === 0)
        return res.status(400).json({ msg: "Hãy thêm ảnh kèm theo." });

      const newPost = new Posts({
        content,
        images,
        user: req.user._id,
      });
      await newPost.save();

      res.json({
        msg: "Đã tạo bài viết",
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;

      const updatePost = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          images,
        }
      )
        .populate("user")
        .populate("comments");

      res.json({
        msg: "Đã cập nhật bài viết",
        updatePost: {
          ...updatePost._doc,
          content,
          images,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deletePost: async (req, res) => {
    try {
      const deletePost = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      await Comments.deleteMany({ _id: { $in: post.comments } });

      res.json({
        msg: "Đã xoá bài viết",
        deletePost: {
          ...deletePost._doc,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPosts: async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const skip = (page - 1) * DEFAULT_LIMIT_POST;

      const posts = await Posts.find({
        user: [...req.user.following, req.user._id],
      })
        .skip(skip)
        .limit(DEFAULT_LIMIT_POST)
        .sort("-updatedAt")
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      return res.json({ posts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const skip = (page - 1) * DEFAULT_LIMIT_POST;
      
      const posts = await Posts.find({ user: req.params.id })
        .skip(skip)
        .limit(DEFAULT_LIMIT_POST)
        .sort("-createdAt");

      res.json({
        posts,
        result: posts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      if (!post)
        return res.status(400).json({ msg: "This post does not exist." });

      res.json({
        post,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPostsDicover: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 9;

      const posts = await Posts.aggregate([
        { $match: { user: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
      ]);

      return res.json({
        msg: "Success!",
        result: posts.length,
        posts,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Posts.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (post.length > 0)
        return res.status(400).json({ msg: "Bạn đã thích bài viết này." });

      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "Bài viết không tồn tại." });

      res.json({ msg: "Thích bài viết!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unLikePost: async (req, res) => {
    try {
      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "Bài viết không tồn tại." });

      res.json({ msg: "Bỏ thích bài viết!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  savePost: async (req, res) => {},
  unSavePost: async (req, res) => {},
  getSavePosts: async (req, res) => {},
};
