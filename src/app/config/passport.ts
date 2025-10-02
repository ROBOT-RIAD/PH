/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import passport from "passport";
import { Strategy as googleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVariabls } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";


passport.use(
    new LocalStrategy({
        usernameField : "email",
        passwordField : "password"
    },async(email : string , password : string , done : VerifyCallback)=>{
        try {

            const ifUserexist = await User.findOne({email})
            if(!ifUserexist){
              return done(null , false , {message : "user nt exist"});
            }

            const ifPassword = await bcryptjs.compare(password as string , ifUserexist.password as string);
            
            if(ifPassword){
                return done(null , false , {message : "passwort does't match"});
            }
            return done(null , ifUserexist)    
        } catch (error) {
            console.log(error)
            done(error)      
        }

    })
)


passport.use(
    new googleStrategy(
    {
        clientID : envVariabls.GOOGLE_CLIENT_ID,
        clientSecret : envVariabls.GOOGLE_CLIENT_SECRET,
        callbackURL : envVariabls.GOOGLE_CALLBACK_URL
    }, async(accessToken : string , refreshToken : string ,profile: Profile , done : VerifyCallback )=>{
        try {
            const email = profile.emails?.[0].value;
            if(!email){
                return done(null , false ,{message : " no email found"})
            } 
            let user = await User.findOne({email});

            if(!user){
                user = await User.create({
                    email,
                    name : profile.displayName,
                    picture : profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auth : [
                        {
                            provider : "google",
                            providerId : "profile.id"
                        }
                    ]

                })

            return done(null , user)

            }
        } catch (error) {
            console.log(error);  
            return done(error); 
        }
        
    }
    )
)


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void)=>{
  done(null , user._id)
})

passport.deserializeUser(async(id : string , done : any)=>{
    try {
        const user = User.findById(id);
        done(null , user);
    } catch (error) {
        done(error)
    }

})