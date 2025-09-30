import { envVariabls } from "../config/env"
import { IAuthprovider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs"

export const seedsupperadmin = async()=>{
    try {
        const isSuperadminExist = await User.findOne({email : envVariabls.SUPER_ADMIN_EMAIL});

        if(isSuperadminExist){
            console.log("Super admin exist");
            return;
        }

        const hashPassword = await bcryptjs.hash(envVariabls.SUPER_ADMIN_PASSWORD,Number(envVariabls.BCRYPT_SALT_ROUND))

        const authprovider: IAuthprovider = {
            provider : "credentials",
            providerId : envVariabls.SUPER_ADMIN_EMAIL
        }

        const paylod : IUser = {
            name : "riad",
            email : envVariabls.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            role: Role.SUPER_ADMIN,
            auth: [authprovider],
            isVerified : true,
        }

        const Superadmin = await User.create(paylod);
        console.log("create super user")
        
    } catch (error) {
        console.log(error)
        
    }
}