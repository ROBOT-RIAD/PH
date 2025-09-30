import passport from "passport";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import { envVariabls } from "./env";


passport.use(
    new googleStrategy(
    {
        clientID : envVariabls.GOOGLE_CLIENT_ID,
        clientSecret : envVariabls.GOOGLE_CLIENT_SECRET,
        callbackURL : envVariabls.GOOGLE_CALLBACK_URL
    }, async()=>{
        
    }
    )
)