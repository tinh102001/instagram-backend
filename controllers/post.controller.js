import { Posts } from "../models/post.model.js";
import { Users } from "../models/user.model.js";
import { Comments } from "../models/comment.model.js";

export const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body

      if(images.length === 0)
      return res.status(400).json({msg: "Hãy thêm ảnh kèm theo."})

      const newPost = new Posts({
          content, images, user: req.user._id
      })
      await newPost.save()

      res.json({
          msg: 'Đã tạo bài viết',
          newPost: {
              ...newPost._doc,
              user: req.user
          }
      })
  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
  },
  getPosts: async (req, res) => {},
  updatePost: async (req, res) => {
    try {
        const { content, images } = req.body

        const updatePost = await Posts.findOneAndUpdate({_id: req.params.id}, {
            content, images
        })
        .populate("user")
        .populate("comments")
        
        res.json({
            msg: "Đã cập nhật bài viết",
            updatePost: {
                ...updatePost._doc,
                content, images
            }
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  },
  likePost: async (req, res) => {},
  unLikePost: async (req, res) => {},
  getUserPosts: async (req, res) => {},
  getPost: async (req, res) => {},
  getPostsDicover: async (req, res) => {},
  deletePost: async (req, res) => {
    try {
        const deletePost = await Posts.findOneAndDelete({_id: req.params.id, user: req.user._id})
        await Comments.deleteMany({_id: {$in: post.comments }})

        res.json({
            msg: 'Đã xoá bài viết',
            deletePost: {
                ...deletePost._doc,
                user: req.user
            }
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  },
  savePost: async (req, res) => {},
  unSavePost: async (req, res) => {},
  getSavePosts: async (req, res) => {},
};
