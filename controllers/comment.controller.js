import { commentServices } from "../services/comment.service.js";

export const commentController = {
  createComment: async (req, res) => {
    try {
      const { postId, content, tag, reply, postUserId } = req.body;

      const newComment = await commentServices.create(
        req.user._id,
        postId,
        content,
        tag,
        reply,
        postUserId
      );

      res.json({ newComment });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const { content } = req.body;

      const updateComment = await commentServices.update(
        req.params.id,
        req.user._id,
        content
      );

      res.json({ msg: "Đã sửa đổi bình luận", comment: updateComment });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await commentServices.delete(req.params.id, req.user._id);

      res.json({ msg: "Đã xoá bình luận", comment: comment });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  likeComment: async (req, res) => {
    try {
      const comment = await commentServices.like(
        req.params.id,
        req.user._id,
        res
      );

      res.json({ msg: "Đã thích bình luận", comment: comment });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unLikeComment: async (req, res) => {
    try {
      const comment = await commentServices.unlike(req.params.id, req.user._id);

      res.json({ msg: "Đã bỏ thích bình luận", comment: comment });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
