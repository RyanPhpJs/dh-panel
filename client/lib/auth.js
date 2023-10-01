import { useContext } from "react";
import UserContext from "../context/User";
import { RequestBuilder, request } from "./api";

export class Auth {

    getToken(){
        return localStorage.getItem("dh_token") || null;
    }

    setToken(value){
        return localStorage.setItem("dh_token", value);
    }

    getUser(token){
        return request("/api/v1/user")
            .token(token)
            .method("GET")
            .json();
    }

}

export function useAuth(){
    
    const context = useContext(UserContext);

    return context;

}

export function useApi(){

    return (url, disableThrow=false) => new RequestBuilder(url, localStorage.getItem("dh_token"), disableThrow)

}