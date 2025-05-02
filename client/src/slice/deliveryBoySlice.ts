import { createSlice } from "@reduxjs/toolkit";
import { IDeliveryBoyState } from "../interfaces/deliveryboy/IDeliveryBoyState";


const initialState : IDeliveryBoyState ={
    deliveryBoy: null,
}

const deliveryBoySlice = createSlice({
    name:'deliveryBoy',
    initialState,
    reducers:{
        setDeliveryBoy(state, action) {
            state.deliveryBoy = action.payload;
        },
        logoutDeliveryboy(state) {
            state.deliveryBoy = null;
        },
    },
})

export const { setDeliveryBoy, logoutDeliveryboy } = deliveryBoySlice.actions;
export default deliveryBoySlice.reducer;