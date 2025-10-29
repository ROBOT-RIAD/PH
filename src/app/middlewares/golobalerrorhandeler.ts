/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVariabls } from "../config/env"
import AppError from "../errorHelpers/appError";
import { handleDuplicateError } from "../helper/handleDuplicateError";
import { handleCastError } from "../helper/handleCastError";
import { handleZordError } from "../helper/handleZordError";
import { handlevaliudationError } from "../helper/handlevaliudationError";
import { TErrorSources } from "../interfaces/error.types";



export const globalErrorHandeler = (err : any , req : Request , res : Response , next : NextFunction)=>{

    if(envVariabls.NODE_ENV === "development"){
        console.log(err);
    }

    let statusCode : string | number = 500;
    let message = `somethimg went wrong`
    let errorSources : TErrorSources[] =[]


    if(err.code === 11000){ //dublicaate error 
      const simplifiedError =handleDuplicateError(err)
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
    }else if(err.name === "CastError"){ //Objact Id Error
        const simplifiedError =handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if(err.name === "zodError"){
        //mongoose validation error
        const simplifiedError = handleZordError(err);
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }  
    else if(err.name === "ValidationError"){
        const simplifiedError = handlevaliudationError(err);
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources  as TErrorSources[]  
    }
    else if(err instanceof AppError){
        statusCode = err.statusCode;
        message = err.message;
    }else if( err instanceof Error){
        statusCode = 500;
        message = err.message;
    }
    res.status(Number(statusCode)).json({
        success : false,
        message ,
        errorSources,
        err: envVariabls.NODE_ENV === "development" ? err : null,
        stack : envVariabls.NODE_ENV === "development" ? err.stack : null,
    })
}

