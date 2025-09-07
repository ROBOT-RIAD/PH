import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;



const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://library:MDriadhossen@cluster0.b18k8.mongodb.net/TourManage?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("connected to db");
    server =app.listen(5000, () => {
      console.log("sercer is running or 5000");
    });
  } catch (error) {
    console.log(error);
  }
};



startServer();


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
 





