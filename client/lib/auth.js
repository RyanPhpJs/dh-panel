import { useContext } from "react";
import UserContext from "../context/User";
import { request } from "./api";

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

    login(username, password){

    }

}

export function useAuth(){
    
    const context = useContext(UserContext);

    return context;

}