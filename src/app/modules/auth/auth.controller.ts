/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendresponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { setAuthCookie } from "../../utils/setCookie";

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
  const decodedToken = req.user ;
  const newpassword = req.body.newpassword;
  const oldpassword = req.body.oldpassword;

  await  AuthService.resetPassword(oldpassword,newpassword,decodedToken)

    


  sendResponse(res , {
            statusCode : httpStatus.OK,
            message: "user password change success",
            success : true,
            data:null,
        })
}



export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword
}
