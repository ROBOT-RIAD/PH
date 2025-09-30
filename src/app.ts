
import express, {  Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandeler } from "./app/middlewares/golobalerrorhandeler";
import NotFount from "./app/middlewares/notFount";
import cookieParser from 'cookie-parser';
import passport from "passport";
import expressSession from "express-session";

const app = express();

//gogole
app.use(expressSession({
    secret : "mriad",
    resave : false,
    saveUninitialized : false
}))
app.use(passport.initialize())
app.use(passport.session())


app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/", router);


app.get("/",(req : Request , res : Response)=>{
    res.status(200).send("server is running");
})



app.use(globalErrorHandeler)
app.use(NotFount)


export default app;
