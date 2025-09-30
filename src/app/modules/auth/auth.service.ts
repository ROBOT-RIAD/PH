import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, CreateuserTokens } from "../../utils/UserToken";
import { IUser } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { envVariabls } from "../../config/env";

const credentialsLogin = async( payload : Partial<IUser>) =>{
    const {email , password } = payload;

    const ifUserexist = await User.findOne({email})
    if(!ifUserexist){
    throw new AppError(httpStatus.BAD_REQUEST , "user does not  exist ");
    }

    const ifPassword = await bcryptjs.compare(password as string , ifUserexist.password as string);

    if(ifPassword){
        throw new AppError(httpStatus.BAD_REQUEST , "password not match");
    }

    // const jwtpaylod ={
    //     id : ifUserexist._id,
    //     email : ifUserexist.email,
    //     role : ifUserexist.role,
    // }
    // const accessToken = genarateToken(jwtpaylod ,envVariabls.JWT_ACCESS_SECET,envVariabls.JWT_ACCESS_EXPIRES);

    // const refreshToken = genarateToken(jwtpaylod,envVariabls.JWR_REFRESH_SECRET,envVariabls.JWT_REFRESH_EXPIRES);

    const userToken = CreateuserTokens(ifUserexist);



    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password : pass  , ...rest} = ifUserexist.toObject();
    return {
        accessToken : userToken.accessToken,
        refreshToken : userToken.refreshToken,
        user : rest,
    }

}



const getNewAccessToken = async (refreshToken : string)=>{
    const newToken = await createNewAccessTokenWithRefreshToken(refreshToken);
    return newToken;
}

const resetPassword = async (oldpassword : string ,newpassword : string, decodedToken : JwtPayload )=>{

    const user = await User.findById(decodedToken._id);

    const isOldpasswordMatch = await bcryptjs.compare(oldpassword , user?.password as string);

    if(!isOldpasswordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED , "Old password dos't match");
    }
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.password = await bcryptjs.hash(newpassword , Number(envVariabls.BCRYPT_SALT_ROUND));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.save()
}


export const AuthService = {
   credentialsLogin,
   getNewAccessToken,
   resetPassword
}