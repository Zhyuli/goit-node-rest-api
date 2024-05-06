import { User } from "../models/user.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import gravatar from "gravatar";
import fs from "fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import sendEmail from "../helpers/sendEmail.js";
dotenv.config();

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join("public", "avatars");

const registerUser = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_black" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Verification email sent",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Сonfirm your registration",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to confirm your registration</a>`,
  };
  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  const { subscription } = user;
  res.status(200).json({
    token,
    user: {
      email,
      subscription,
    },
  });
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "No file provided");
  }

  const { _id } = req.user;
  const { path: tempUpload, originalname, size } = req.file;

  if (size > 2 * 1024 * 1024) {
    throw HttpError(400, "File is too large!");
  }

  await Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(250, 250).quality(60).write(tempUpload);
    })
    .catch((err) => {
      throw err;
    });

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    avatarURL,
  });
};

export const controllers = {
  registerUser: ctrlWrapper(registerUser),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  loginUser: ctrlWrapper(loginUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logoutUser: ctrlWrapper(logoutUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
