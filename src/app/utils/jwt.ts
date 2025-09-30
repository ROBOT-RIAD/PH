import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const genarateToken = (payload : JwtPayload , secret : string , expiresIn : string ) =>{
    const Token = jwt.sign(payload,secret,{expiresIn} as SignOptions);
    return Token
}


export const verifyToken = (Token : string , secret : string) =>{
    const verifyToken = jwt.verify(Token,secret);
    return verifyToken;
}