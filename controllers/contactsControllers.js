import HttpError from "../helpers/HttpError.js";

import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

import { Contact } from "../models/contact.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const allContacts = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.json(allContacts);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user; //
  const result = await Contact.findOne({ _id: id, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ _id: id, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const { _id: owner } = req.user;
  const result = await Contact.create({ name, email, phone, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const { name, email, phone, favorite } = req.body;
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }
  const update = await Contact.findOneAndUpdate(
    { _id: id, owner },
    { name, email, phone, favorite },
    { new: true }
  );
  if (!update) {
    throw HttpError(404, "Not found");
  }
  res.json(update);
};

const updateFavourite = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const { favorite } = req.body;
  const updateFavourite = await Contact.findOneAndUpdate(
    { _id: id, owner },
    { favorite },
    { new: true }
  );
  if (!updateFavourite) {
    throw HttpError(404, "Not found");
  }
  res.json(updateFavourite);
};

export const controllers = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateFavourite: ctrlWrapper(updateFavourite),
};
