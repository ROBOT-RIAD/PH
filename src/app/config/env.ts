import dotenv from "dotenv";

dotenv.config();

interface EnvConfic{
     PORT : string,
    DB_URL : string,
    NODE_ENV : "development" | "production",

}

const loadEnvvariables = () : EnvConfic=>{
    const rquiredEnv : string[]=['PORT','DB_URL','NODE_ENV'];

    rquiredEnv.forEach(key =>{
        if(!process.env[key]){
            throw new Error(`missing required enviroment variable ${key}`)
        }
    })
    return {
    PORT : process.env.PORT as string,
    DB_URL : process.env.DB_URL as string,
    NODE_ENV : process.env.NODE_ENV  as "development" | "production",
}
}

export const envVariabls = loadEnvvariables();