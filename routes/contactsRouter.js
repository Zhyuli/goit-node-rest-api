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

contactsRouter.get("/:id", isValidId, ctrl.getOneContact);

contactsRouter.delete("/:id", isValidId, ctrl.deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), ctrl.createContact);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  ctrl.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrl.updateFavorite
);

export default contactsRouter;
