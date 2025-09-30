import { Response } from "express"

interface TMeta{
    total : number
}


interface TReaponse<T>{
    statusCode : number,
    success : boolean,
    message : string,
    data :T,
    meta ?: TMeta
}

const sendResponse = <T>(res : Response , data : TReaponse<T>) =>{

    res.status(data.statusCode).json({
        success : data.success,
        statusCode : data.statusCode,
        message : data.message,
        meta : data.meta,
        data : data.data
    })

}


export default sendResponse;