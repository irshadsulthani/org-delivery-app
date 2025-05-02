import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { Navigate, Outlet } from "react-router-dom"

function AdminProtectedRoutes() {
    const currentUser = useSelector((state: RootState) => state.admin.admin)
    console.log("currentUser", currentUser);
    
    if(currentUser && currentUser.role !== "admin") {
        return <Navigate to="/admin/login" />
    }
    return currentUser ? <Outlet /> : <Navigate to="/admin/login" />
}

export default AdminProtectedRoutes