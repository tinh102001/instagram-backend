import { Users } from "../models/user.model.js";
import { userServices } from "../services/user.service.js";

export const userController = {
  searchUser: async (req, res) => {
    try {
      const searchResult = await userServices.search(req.query.username)
      
      res.json({ searchResult });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await userServices.get(req.params.id)

      if (user === 0)
        return res.status(400).json({ msg: "Người dùng không tồn tại." });

      res.json({ user: user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { avatar, fullname, mobile, address, story, website, gender } = req.body;
      if (!fullname)
        return res.status(400).json({ msg: "Hãy thêm tên đầy đủ." });
      
      const user = await userServices.update(req.user._id, avatar, fullname, mobile, address, story, website, gender)
      res.json({ msg: "Cập nhật thành công!", user: user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  follow: async (req, res) => {
    try {
      const newUser = await userServices.follow(req.params.id, req.user._id)
      res.json({ msg: "Đã theo dõi người dùng", newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      await userServices.unfollow(req.params.id, req.user._id)

      res.json({ msg: "Đã bỏ theo dõi người dùng" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  suggestionsUser: async (req, res) => {},
};
