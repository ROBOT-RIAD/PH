/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError";
import { IAuthprovider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVariabls } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUserService = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const ifUserexist = await User.findOne({ email });

  if (ifUserexist) {
    throw new AppError(httpStatus.BAD_REQUEST, "user Already exist ");
  }

  const hashpassword = await bcryptjs.hash(
    password as string,
    Number(envVariabls.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthprovider = {
    provider: "credentials",
    providerId: email as string,
  };
  const user = await User.create({
    email,
    password: hashpassword,
    auth: authProvider,
    ...rest,
  });
  return user;
};

const getAllUser = async () => {
  const users = await User.find({});
  const totalUser = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const userExist = await User.findById(userId);
  if (!userExist) {
    throw new AppError(httpStatus.NOT_FOUND, "user not exist");
  }
  

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorize");
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorize");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorize");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVariabls.BCRYPT_SALT_ROUND
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdateUser;
};

export const UserServies = {
  createUserService,
  getAllUser,
  updateUser,
};
