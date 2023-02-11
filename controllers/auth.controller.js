import { Users } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authCtrl = {
  register: async (req, res) => {},
  login: async (req, res) => {},
  logout: async (req, res) => {},
  generateAccessToken: async (req, res) => {},
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "20m",
  });
};
