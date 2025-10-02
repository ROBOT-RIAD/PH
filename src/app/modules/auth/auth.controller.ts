/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendresponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { CreateuserTokens } from "../../utils/UserToken";
import { envVariabls } from "../../config/env";


const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthService.credentialsLogin(req.body);

    // res.cookie("accessToken",loginInfo.accessToken,{
    //   httpOnly: true,
    //   secure : false,
    // })

    // res.cookie("refreshToken",loginInfo.refreshToken,{
    //   httpOnly: true,
    //   secure : false,
    // })


    setAuthCookie(res, loginInfo);

    sendResponse(res , {
            statusCode : httpStatus.OK,
            message: "user Login success",
            success : true,
            data:loginInfo,
        })

  }
);


const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken =  req.cookies.refreshToken;
    if(!refreshToken){
      throw new AppError(httpStatus.BAD_REQUEST , "no refresh token")
    }
    const TokenInfo = await AuthService.getNewAccessToken(refreshToken as string);

    // res.cookie("accessToken",TokenInfo.accessToken,{
    //   httpOnly: true,
    //   secure : false,
    // })

    // res.cookie("refreshToken",TokenInfo.refreshToken,{
    //   httpOnly: true,
    //   secure : false,
    // })

    setAuthCookie(res, TokenInfo);

    sendResponse(res , {
            statusCode : httpStatus.OK,
            message: "user Token get success",
            success : true,
            data:TokenInfo,
        })

  }
);

const logout =async (req: Request, res: Response, next: NextFunction)=>{

  res.clearCookie("accessToken",{
    httpOnly: true,
    secure: false,
    sameSite : "lax"
  })
  res.clearCookie("refreshToken",{
    httpOnly: true,
    secure: false,
    sameSite : "lax"
  })


  sendResponse(res , {
            statusCode : httpStatus.OK,
            message: "user Logout success",
            success : true,
            data:null,
        })
}


const resetPassword = async(req: Request, res: Response, next: NextFunction) =>{
  const decodedToken = req.user as JwtPayload | undefined;
  const newpassword = req.body.newpassword;
  const oldpassword = req.body.oldpassword;

  if (!decodedToken) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized",
    });
  }

  await  AuthService.resetPassword(oldpassword,newpassword,decodedToken)

    


  sendResponse(res , {
            statusCode : httpStatus.OK,
            message: "user password change success",
            success : true,
            data:null,
        })
}


const googleCallback =async(req : Request , res : Response , next : NextFunction)=>{

  let state = req.query.state ? req.query.state as string : ""
  if(state.startsWith("/")){
    state = state.slice(1);
  }

  const user = req.user;

  if(!user){
    throw new AppError(httpStatus.NOT_FOUND , "User Not Fount");
  }

  const TokenInfo =  CreateuserTokens(user)

  setAuthCookie(res ,TokenInfo)

  res.redirect(`${envVariabls.FRONTENT_URL}/${state}`);
}



export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallback
}
