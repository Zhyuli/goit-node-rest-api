import { User } from "../models/user.js";

import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

const registerUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await User.create(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      password: newUser.password,
    },
  });
};

export const controllers = {
  registerUser: ctrlWrapper(registerUser),
};
