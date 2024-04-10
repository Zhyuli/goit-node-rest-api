// import {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContactById,
// } from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

import { Contact } from "../models/contact.js";

const getAllContacts = async (req, res) => {
  const allContacts = await Contact.find();
  res.json(allContacts);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const createContact = async (req, res) => {
  // const { error } = createContactSchema.validate(req.body);
  // if (error) {
  //   throw HttpError(400, error.message);
  // }
  const { name, email, phone } = req.body;
  const result = await Contact.create(name, email, phone);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }
  // const { error } = updateContactSchema.validate(req.body);
  // if (error) {
  //   throw HttpError(400, error.message);
  // }
  const existingContact = await getContactById(id);
  if (!existingContact) {
    return res.status(404).json({ message: "Not found" });
  }

  const updatedContact = {
    ...existingContact,
    ...req.body,
  };

  const result = await Contact.findByIdAndUpdate(id, updatedContact);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export const controllers = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
