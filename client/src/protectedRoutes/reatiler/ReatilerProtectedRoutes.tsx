import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { Navigate, Outlet } from "react-router-dom"


function ReatilerProtectedRoutes() {
    const reatilerState = useSelector((state: RootState) => state.retailer.retailer)
    
    return reatilerState ? <Outlet /> : <Navigate to='/retailer/sign-up' />
}

export default ReatilerProtectedRoutes