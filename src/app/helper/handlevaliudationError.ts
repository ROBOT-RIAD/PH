/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";


export const handlevaliudationError =(err : mongoose.Error.ValidationError) : TGenericErrorResponse=>{
    const errorSources : TErrorSources[] = [];
    const erros = Object.values(err.errors)

    erros.forEach((errorObject : any )=> errorSources.push({
        path : errorObject.path,
        message : errorObject.message
    }))
    return {
        statusCode: 400,
        message : "validation Error",
        errorSources
    }

}