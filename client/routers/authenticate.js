import { createContext, useState } from "react";
import { LoadingRouter, Route, RouterManager, Routes, useNavigate } from "../lib/Router";
import { useAuth } from "../lib/auth";
import { HomePage } from "../pages/Home";
import { InternPage } from "../pages/Intern";
import { AdminFileManager } from "../pages/AdminPath";
export function RoutersAuthorized() {
    
    const navigate = useNavigate();
    const { user } = useAuth();
    const [menuItems, setItems] = useState([]);

    return <RouterManager onChange={() => {
        document.body.setAttribute("data-auth", "1")
    }} loading={<LoadingRouter />} notFound={() => <div>404</div>}>
        <InternPage user={user} menuItems={menuItems}>
            <Routes setItems={setItems}>
                <Route path="/" component={HomePage} />
                <Route path="/files" component={AdminFileManager} />
                <Route path="/login" component={() => navigate.to("/")} />
            </Routes>
        </InternPage>
    </RouterManager>

}