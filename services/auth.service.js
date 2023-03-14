import { Users } from "../models/user.model.js";

export const authServices = {
  checkUsername: async (username) => {
    const userName = await Users.findOne({ username: username });
    return userName;
  },
  checkEmail: async (email) => {
    const userEmail = await Users.findOne({ email: email }).populate(
      "followers following",
      "avatar username fullname followers following"
    );
    return userEmail;
  },
  register: async (fullname, username, email, password, gender) => {
    const newUser = new Users({
      fullname: fullname,
      username: username,
      email: email,
      password: password,
      gender: gender,
    });
    await newUser.save();
    return newUser;
  },
  login: async (email) => {
    const user = await Users.findOne({ email: email }).populate(
      "followers following",
      "avatar username fullname followers following"
    );
    return user;
  },
  generate: async (resultId) => {
    const user = await Users.findById(resultId)
      .select("-password")
      .populate(
        "followers following",
        "avatar username fullname followers following"
      );
    return user;
  },
};
