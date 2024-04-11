import express from "express";

import validateBody from "../helpers/validateBody.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavouriteSchema,
} from "../schemas/contactsSchemas.js";

import { controllers as ctrl } from "../controllers/contactsControllers.js";

import { isValidId } from "../helpers/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ctrl.getAllContacts);

contactsRouter.get("/:id", isValidId, ctrl.getOneContact);

contactsRouter.delete("/:id", isValidId, ctrl.deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), ctrl.createContact);

contactsRouter.put(
  "/:id",

  validateBody(updateContactSchema),
  isValidId,
  ctrl.updateContact
);

contactsRouter.patch(
  "/:id/favorite",

  validateBody(updateFavouriteSchema),
  isValidId,
  ctrl.updateFavourite
);

export default contactsRouter;
