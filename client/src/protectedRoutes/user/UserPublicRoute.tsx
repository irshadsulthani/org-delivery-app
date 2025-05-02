import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../app/store";

function PublicOnlyRoute() {
    const currentUser = useSelector((state: RootState) => state.auth.user);
    return currentUser ? <Navigate to="/" /> : <Outlet />;
}

export default PublicOnlyRoute;
