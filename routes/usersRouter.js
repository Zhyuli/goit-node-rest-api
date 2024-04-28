import express from "express";

import validateBody from "../helpers/validateBody.js";

import authenticate from "../helpers/authenticate.js";

import upload from "../helpers/upload.js";

import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";

import { controllers as ctrl } from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), ctrl.registerUser);

usersRouter.post("/login", validateBody(loginSchema), ctrl.loginUser);

usersRouter.get("/current", authenticate, ctrl.getCurrentUser);

usersRouter.post("/logout", authenticate, ctrl.logoutUser);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

export default usersRouter;
