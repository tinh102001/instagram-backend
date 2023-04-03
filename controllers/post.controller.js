import { Posts } from "../models/post.model.js";
import { postServices } from "../services/post.service.js";

const DEFAULT_LIMIT_POST = 6;

export const postController = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;

      if (images.length === 0)
        return res.status(400).json({ msg: "Hãy thêm ảnh kèm theo." });

      const newPost = await postServices.create(content, images, req.user._id);

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

      const updatePost = await postServices.update(
        content,
        images,
        req.params.id
      );

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
      const deletePost = await postServices.delete(req.params.id, req.user._id);
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
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;

      const posts = await postServices.posts(
        req.user.following,
        req.user._id,
        skip,
        limit
      );

      const totalPosts = await postServices.getTotalPosts(
        req.user.following,
        req.user._id
      );

      res.json({
        msg: "Success!",
        result: posts.length,
        posts,
        totalPosts,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const skip = (page - 1) * DEFAULT_LIMIT_POST;

      const posts = await postServices.userPosts(
        req.params.id,
        skip,
        DEFAULT_LIMIT_POST
      );
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
      const post = await postServices.post(req.params.id);
      if (!post)
        return res.status(400).json({ msg: "This post does not exist." });

      res.json({
        post,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getExplorePosts: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];
      const num = req.query.num || 9;

      const posts = await postServices.explorePosts(newArr, num);

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
      const [post, like] = await postServices.like(req.params.id, req.user._id);

      if (post.length > 0)
        return res.status(400).json({ msg: "Bạn đã thích bài viết này." });

      if (!like)
        return res.status(400).json({ msg: "Bài viết không tồn tại." });

      res.json({ msg: "Thích bài viết!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unLikePost: async (req, res) => {
    try {
      const like = await postServices.unlike(req.params.id, req.user._id);

      if (!like)
        return res.status(400).json({ msg: "Bài viết không tồn tại." });

      res.json({ msg: "Bỏ thích bài viết!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  savePost: async (req, res) => {
    try {
      const [user, save] = await postServices.saved(
        req.user._id,
        req.params.id
      );

      if (user.length > 0)
        return res.status(400).json({ msg: "Bạn đã lưu bài viết." });

      if (!save)
        return res.status(400).json({ msg: "Người dùng không tồn tại." });

      res.json({ msg: "Lưu bài viết thành công!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unSavePost: async (req, res) => {
    try {
      const save = await postServices.unSaved(req.user._id, req.params.id);

      if (!save)
        return res.status(400).json({ msg: "Người dùng không tồn tại." });

      res.json({ msg: "Bỏ lưu bài viết thành công!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSavePosts: async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const skip = (page - 1) * DEFAULT_LIMIT_POST;

      const savePosts = await postServices.savedPosts(
        req.user.saved,
        skip,
        DEFAULT_LIMIT_POST
      );

      res.json({
        savePosts,
        result: savePosts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
