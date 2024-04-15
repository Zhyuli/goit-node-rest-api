import { User } from "../models/user.js";

import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const registerUser = async (req, res) => {
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
