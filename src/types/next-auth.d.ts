import "next-auth";

declare module 'next-auth'{
    interface User{
        _id? :string
        isverified? :boolean
        isAcceptingMessage? :boolean
        username? :string
    }
    interface Session{
       user:{
        _id ?:string
        isverified ?:boolean
        isAcceptingMessage ?:boolean
        username ?: string
       }& DefaultSession['user']
    }
}
