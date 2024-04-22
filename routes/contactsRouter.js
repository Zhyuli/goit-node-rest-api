import express from "express";

import validateBody from "../helpers/validateBody.js";
import authenticate from "../helpers/authenticate.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavouriteSchema,
} from "../schemas/contactsSchemas.js";

import { controllers as ctrl } from "../controllers/contactsControllers.js";

import { isValidId } from "../helpers/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, ctrl.getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, ctrl.getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, ctrl.deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  ctrl.createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  ctrl.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavouriteSchema),
  ctrl.updateFavourite
);

export default contactsRouter;
