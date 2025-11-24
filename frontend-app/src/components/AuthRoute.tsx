import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    if (!isAuthenticated) return <Navigate to="/signin" />;
    return <Outlet />;
}

export default AuthRoute;