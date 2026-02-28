import mongoose, { Schema, Document } from "mongoose";


export interface Messsage extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Messsage> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date,required:true, default: Date.now }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isverified: boolean;
    isAcceptingMessages: boolean;
    messages: Messsage[];
    messageCount: number;
}

const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: [true,"Username is required"], unique: true, trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true,match:[/.+@.+\..+/,"Please provide a valid email"] },
    password: { type: String, required: [true, "Password is required"] },
    verifyCode: { type: String,required:[true,"Verify code is required"] },
    verifyCodeExpiry: { type: Date,required:[true,"verifycodeExpiry is required"]},
    isverified:{type : Boolean, default : false},
    isAcceptingMessages: { type: Boolean, default: true },
    messages:[MessageSchema],
    messageCount:{type: Number,default:0}
});

const UserModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema))

export default UserModel