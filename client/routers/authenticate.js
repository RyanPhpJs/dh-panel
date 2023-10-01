import { useState } from "react";
import { LoadingRouter, Route, RouterManager, Routes, useNavigate } from "../lib/Router";
import { useApi, useAuth } from "../lib/auth";
import InternRoutes from "./InternRoutes";
import { InternPage } from "../pages/Intern";
export function RoutersAuthorized() {
    
    const navigate = useNavigate();
    const { user } = useAuth();
    const [menuItems, setItems] = useState([]);

    const validateP = (permissions) => {
        if(user.permissions.includes("ADMINISTRADOR")) return true;
        for(const p of permissions) {
            if(!user.permissions.includes(p)) return false;
        }
        return true;
    }

    const rBuilder = () => {
        const r = [];
        for(const route of InternRoutes){
            const p = route.__init__();
            if(p.permissions && Array.isArray(p.permissions) && p.permissions.length > 0){
                if(validateP(p.permissions)){
                    r.push(<Route path={p.url} component={route} key={p.url}/>)
                }
            }else{
                r.push(<Route path={p.url} component={route} key={p.url}/>)
            }
        }
        return r;
    }

    return <RouterManager onChange={() => {
        document.body.setAttribute("data-auth", "1")
    }} loading={<LoadingRouter />} notFound={() => <div>404</div>}>
        <InternPage user={user} menuItems={menuItems}>
            <Routes setItems={setItems} routes={rBuilder()}>
                <Route path="/login" component={() => navigate.to("/")} />
            </Routes>
        </InternPage>
    </RouterManager>

}