import { LoadingRouter, Route, RouterManager, Routes, useNavigate } from "../lib/Router";
import { LoginPage } from "../pages/LoginPage";

export function RoutersUnathorized() {
    
    const navigate = useNavigate();

    return <RouterManager onChange={() => {
        document.body.setAttribute("data-auth", "0")
    }} loading={<LoadingRouter />} notFound={() => navigate.to("/login")}>
        <Routes>
            <Route path="/login" component={() => <LoginPage />} />
        </Routes>
    </RouterManager>

}