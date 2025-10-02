/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServies } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendresponse";
import { verifyToken } from "../../utils/jwt";
import { envVariabls } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await UserServies.createUserService(req.body);
//     res.status(httpStatus.CREATED).json({
//       message: "user created successfully",
//       user,
//     });

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     console.log(err);
//     next(err);
//   }
// };
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServies.createUserService(req.body);
    // res.status(httpStatus.CREATED).json({
    //   message: "user created successfully",
    //   user,
    // });
    sendResponse(res , {
        statusCode : httpStatus.CREATED,
        message: "user creae success",
        success : true,
        data:user,
    })
  }
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServies.getAllUser();
    sendResponse(res , {
        statusCode : httpStatus.CREATED,
        message: "all user retrive success",
        success : true,
        data:result.data,
        meta: result.meta
    })
  }
);



const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.id
    // const token = req.headers.authorization;
    // const verifidToken = verifyToken(token as string ,envVariabls.BCRYPT_SALT_ROUND) as JwtPayload;
    const verifidToken = req.user ;
    const user = await UserServies.updateUser(userid,req.body ,verifidToken as JwtPayload);
    sendResponse(res , {
        statusCode : httpStatus.CREATED,
        message: "user update success",
        success : true,
        data:user,
    })
  }
);

export const UserController = {
  createUser,
  getAllUser,
  updateUser,
};
