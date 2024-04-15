import express from "express";

import validateBody from "../helpers/validateBody.js";

import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";

import { controllers as ctrl } from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), ctrl.registerUser);

export default usersRouter;
