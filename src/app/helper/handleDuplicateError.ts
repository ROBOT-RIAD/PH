/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types"


export const handleDuplicateError = (err : any) : TGenericErrorResponse =>{
    const matchArrya = err.message.match(/"([^"]*)"/) 
    return {
        statusCode : 400,
        message :`${matchArrya[1]} already exist`
    }
}