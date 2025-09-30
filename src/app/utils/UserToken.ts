import { JwtPayload } from "jsonwebtoken";
import { envVariabls } from "../config/env";
import AppError from "../errorHelpers/appError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { genarateToken, verifyToken } from "./jwt";
import httpStatus from 'http-status-codes';

export const CreateuserTokens = (user: Partial<IUser>) => {
  const jwtpaylod = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = genarateToken(
    jwtpaylod,
    envVariabls.JWT_ACCESS_SECET,
    envVariabls.JWT_ACCESS_EXPIRES
  );

  const refreshToken = genarateToken(
    jwtpaylod,
    envVariabls.JWR_REFRESH_SECRET,
    envVariabls.JWT_REFRESH_EXPIRES
  );
  return {
    accessToken,
    refreshToken
  }
};



export const createNewAccessTokenWithRefreshToken= async( refreshToken : string)=>{

   const verifiedRefreshToken = verifyToken(refreshToken, envVariabls.JWR_REFRESH_SECRET) as JwtPayload;


    const ifUserexist = await User.findOne({email : verifiedRefreshToken.email});

    if(!ifUserexist){
    throw new AppError(httpStatus.BAD_REQUEST , "user does not  exist ");
    }
    if(ifUserexist.isActive === IsActive.BLOCKED || ifUserexist.isActive === IsActive.INACTIVE){
    throw new AppError(httpStatus.BAD_REQUEST , "user is blockd");
    }
    if(ifUserexist.isDeleted){
    throw new AppError(httpStatus.BAD_REQUEST , "user is deleted");
    }

    const userToken = CreateuserTokens(ifUserexist);
    
    return {
        accessToken : userToken.accessToken,
        refreshToken : userToken.refreshToken,
    }
}
