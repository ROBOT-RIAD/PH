import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import { envVariabls } from "../config/env";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "no token recived");
      }
      const varifiedToken = verifyToken(
        accessToken,
        envVariabls.JWT_ACCESS_SECET
      ) as JwtPayload;


      const ifUserexist = await User.findOne({email : varifiedToken.email});
      
      if(!ifUserexist){
      throw new AppError(httpStatus.BAD_REQUEST , "user does not  exist ");
      }
      if(ifUserexist.isActive === IsActive.BLOCKED || ifUserexist.isActive === IsActive.INACTIVE){
      throw new AppError(httpStatus.BAD_REQUEST , "user is blockd");
      }
      if(ifUserexist.isDeleted){
      throw new AppError(httpStatus.BAD_REQUEST , "user is deleted");
      }

      if (!varifiedToken) {
        throw new AppError(403, "you are not authorized");
      }

      if (!authRole.includes(varifiedToken.role)) {
        throw new AppError(403, "you are not permited");
      }
      req.user = varifiedToken ;
      next();
    } catch (error) {
      next(error);
    }
  };
