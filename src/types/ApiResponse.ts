import {Messsage} from "@/src/model/user.model"
export interface ApiResponse{
    success:boolean;
    message:string,
    isAcceptingMessages? : boolean
    messages? : Array<Messsage>
}