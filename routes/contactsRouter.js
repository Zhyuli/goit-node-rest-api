import express from "express";

import validateBody from "../helpers/validateBody.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

import { controllers as ctrl } from "../controllers/contactsControllers.js";

import { isValidId } from "../helpers/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ctrl.getAllContacts);

contactsRouter.get("/:id", ctrl.getOneContact); // isValidId,

contactsRouter.delete("/:id", ctrl.deleteContact); //isValidId,

contactsRouter.post("/", validateBody(createContactSchema), ctrl.createContact);

contactsRouter.put(
  "/:id",

  validateBody(updateContactSchema),
  ctrl.updateContact
); //isValidId,

contactsRouter.patch(
  "/:id/favorite",

  validateBody(updateFavoriteSchema),
  ctrl.updateFavorite
); //  isValidId,

export default contactsRouter;
