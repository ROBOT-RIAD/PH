/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVariabls } from "./app/config/env";
import { seedsupperadmin } from "./app/utils/seedsuperadmin";

let server: Server;


const startServer = async () => {
  console.log(envVariabls.NODE_ENV);
  try {
    await mongoose.connect(envVariabls.DB_URL);
    console.log("connected to db");
    server =app.listen(envVariabls.PORT, () => {
      console.log("sercer is running or 5000");
    });
  } catch (error) {
    console.log(error);
  }
};



(async()=>{
    await startServer();
    await seedsupperadmin();
})()


process.on("unhandledRejection", (error)=>{
    console.log("unhandled rejection error", error);
    if(server){
        server.close(()=>{
            process.exit(1);
        });
    }
    process.exit(1);
})

process.on("uncaughtException", (error)=>{
    console.log("uncaught Exception error", error);
    if(server){
        server.close(()=>{
            process.exit(1);
        });
    }
    process.exit(1);
})


process.on("SIGTERM", ()=>{
    console.log("SIGTERM error");
    if(server){
        server.close(()=>{
            process.exit(1);
        });
    }
    process.exit(1);
})



//unhandled rejection error
//uncaught rejection error
// signal termination sigterm
 





