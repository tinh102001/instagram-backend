import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authServices } from "../services/auth.service.js";

export const authController = {
  register: async (req, res) => {
    try {
      const { fullname, username, email, password, gender } = req.body;
      const userName = await authServices.checkUsername(username);
      if (userName)
        return res.status(400).json({ msg: "Tên người dùng đã tồn tại." });

      const userEmail = await authServices.checkEmail(email);
      if (userEmail)
        return res.status(400).json({ msg: "Email này đã tồn tại." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Mật khẩu phải có ít nhất 6 kí tự." });

      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = await authServices.register(
        fullname,
        username,
        email,
        passwordHash,
        gender
      );

      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });

      res.json({
        msg: "Đăng kí thành công!",
        accessToken,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await authServices.checkEmail(email);
      if (!user)
        return res.status(400).json({ msg: "Email này không tồn tại." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Mật khẩu không chính xác." });

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });

      res.json({
        msg: "Đăng nhập thành công!",
        accessToken,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Đăng xuất thành công!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshtoken;
      if (!refreshToken)
        return res.status(400).json({ msg: "Xin hãy đăng nhập." });

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: "Xin hãy đăng nhập." });

          const user = await authServices.generate(result.id);
          if (!user)
            return res.status(400).json({ msg: "Người dùng không tồn tại." });

          const accessToken = createAccessToken({ id: result.id });

          res.json({
            accessToken,
            user,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
