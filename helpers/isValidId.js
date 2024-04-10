import { isValidObjectId } from "mongoose";
import { httpError } from "../helpers";

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    next(httpError(400, `${id} is not valid id`));
  }
  next();
};
