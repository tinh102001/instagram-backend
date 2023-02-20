import { Posts } from "../models/post.model.js";
import { Comments } from "../models/comment.model.js";

export const commentCtrl = {
  createComment: async (req, res) => {
    try {
      const { postId, content, tag, reply, postUserId } = req.body

      const newComment = new Comments({
          user: req.user._id, content, tag, reply, postUserId, postId
      })

      await Posts.findOneAndUpdate({_id: postId}, {
          $push: {comments: newComment._id}
      }, {new: true})

      await newComment.save()

      res.json({newComment})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  },
  updateComment: async (req, res) => {
    try {
      const { content } = req.body

      await Comments.findOneAndUpdate({
          _id: req.params.id, user: req.user._id
      }, {content})

      res.json({msg: 'Đã sửa đổi bình luận'})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  },
  likeComment: async (req, res) => {},
  unLikeComment: async (req, res) => {},
  deleteComment: async (req, res) => {
    try {
      const comment = await Comments.findOneAndDelete({
          _id: req.params.id,
          $or: [
              {user: req.user._id},
              {postUserId: req.user._id}
          ]
      })

      await Posts.findOneAndUpdate({_id: comment.postId}, {
          $pull: {comments: req.params.id}
      })

      res.json({msg: 'Đã xoá bình luận'})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  },
};
