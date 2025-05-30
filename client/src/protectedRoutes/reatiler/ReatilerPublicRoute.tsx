import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { Navigate, Outlet } from "react-router-dom"


function ReatilerPublicRoute() {
    const reatilerState = useSelector((state : RootState) => state.retailer.retailer )

    return reatilerState ? <Navigate to='/retailer/dashboard' /> : <Outlet />
}

export default ReatilerPublicRoute