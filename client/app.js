import { useContext, useState } from "react";
import { RouterManager, Route, LoadingRouter, Link, Routes } from "./lib/Router";
import UserContext from "./context/User";
import { Auth, useAuth } from "./lib/auth";
import { useAsync } from "react-async";
import { RoutersUnathorized } from "./routers/unauth";

export function useUser(){
    const context = useContext(UserContext);
    return {
        user: context.user,
        reload(){
            context.setUser({ user: null, pending: true })
        }
    }
}

export function Application(){

    const [user, setUser] = useState({ user: null, pending: true });

    const auth = new Auth();

    return <UserContext.Provider value={{ user: user.user, setUser, auth, pending: user.pending }}>
        <PageRouter />
    </UserContext.Provider>
}

async function AuthVerify({ setUser, auth }){
    
    const token = auth.getToken();
    if(!token) return setUser({ user: null, pending: false });

    try {
        const user = await auth.getUser(token);
        if(!user.success) return setUser({ user: null, pending: false });

        return setUser({ user: user.data, pending: false });
    } catch (err) {
        console.log("ERRO", err);
        return setUser({ user: null, pending: false });
    }

    

}

function PendingPage({ setUser, auth }){
    const { isPending, error, data } = useAsync({ promiseFn: AuthVerify, setUser, auth });
    if(isPending)
        return <div>Loading Application...</div>
    return null;
}

function PageRouter() {

    const { auth, user, setUser, pending } = useAuth();

    if(pending){
        return <PendingPage setUser={setUser} auth={auth} />
    }

    console.log(user);

    if(user){
        return <div>User authenticated</div>
    }

    return <RoutersUnathorized setUser={setUser} auth={auth} />

}