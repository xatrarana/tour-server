import { Types } from "mongoose";
import { User } from "../models/user.model";
import { tryCatch } from "../utils/tryCatch";

export const getUsers = async () => {
  await tryCatch(async () => {
    return await User.find();
  });
};

export const getUserById = async (id: Types.ObjectId) => {
  tryCatch(async () => {
    await User.findById(id);
  });
};

export const getUserByUsername = async (username: string) => {
  await tryCatch(async () => {
    await User.findOne({ username });
  });
};

export const getUserByEmail = async (email: string) => {
  await tryCatch(async () => {
    await User.findOne({ email });
  });
};
