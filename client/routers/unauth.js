import { LoadingRouter, Route, RouterManager, Routes, useNavigate } from "../lib/Router";
import { LoginPage } from "../pages/LoginPage";

export function RoutersUnathorized() {
    
    const navigate = useNavigate();

    return <RouterManager loading={<LoadingRouter />} notFound={() => navigate.to("/login")}>
        <Routes>
            <Route path="/login" component={() => <LoginPage />} />
        </Routes>
    </RouterManager>

}