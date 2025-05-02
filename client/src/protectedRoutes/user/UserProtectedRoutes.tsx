import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../app/store";

function UserProtectedRoutes() {
    const currentUser = useSelector((state: RootState) => state.auth.user)
    if(currentUser && currentUser.role !== "customer") {
        return <Navigate to="/sign-up" />
    }
    return currentUser ? <Outlet /> : <Navigate to="/sign-up" /> 
}

export default UserProtectedRoutes