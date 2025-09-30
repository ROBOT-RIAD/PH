import { Request, Response } from "express";
import httpStatus from "http-status-codes";



const NotFount = (req : Request , res : Response)=>{
    res.status(httpStatus.NOT_FOUND).json({
        success : false,
        message : "Not Fount",
    })
}

export default NotFount;