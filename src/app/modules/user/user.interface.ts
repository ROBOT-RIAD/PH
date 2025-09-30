import { Types } from "mongoose";


export enum Role{
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN  = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

// AUTH PROBIDERS 

export interface IAuthprovider{
    provider : "google" | "credentials"; //google or credentials
    providerId : string
}

export enum IsActive{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IUser{
    _id ?: Types.ObjectId,
    name : string;
    email : string;
    password ?: string;
    phone ?: string;
    picture ?: string;
    address ?: string;
    isDeleted ?: string;
    isActive ?: IsActive;
    isVerified ?: boolean;
    role: Role;
    auth : IAuthprovider[];
    bookings ?: Types.ObjectId[];
    guides ?: Types.ObjectId[];
}