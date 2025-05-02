import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { Navigate, Outlet } from "react-router-dom"

function AdminPublicRoute() {
    const currentUser = useSelector((state: RootState) => state.admin.admin )
    return currentUser ? <Navigate to="/admin/dashboard" /> : <Outlet />
}

export default AdminPublicRoute