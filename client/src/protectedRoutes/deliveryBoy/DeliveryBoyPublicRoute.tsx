import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { Navigate, Outlet } from "react-router-dom"


function DeliveryBoyPublicRoute() {
    const deliveryBoyState = useSelector((state : RootState) => state.deliveryBoy.deliveryBoy)

    return deliveryBoyState ? <Navigate to='/delivery/dashboard'/> : <Outlet />
}

export default DeliveryBoyPublicRoute