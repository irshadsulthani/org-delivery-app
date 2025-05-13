import { createSlice } from "@reduxjs/toolkit";
import { IReatilerState } from "../interfaces/reatiler/IReatilerState";


const initialState : IReatilerState = {
    retailer : null
}

const reatilerSlice = createSlice({
    name:'retailer',
    initialState,
    reducers:{
        setReatiler(state, action) {
            state.retailer = action.payload
        },
        reatilerLogout(state){
            state.retailer = null
        }
    }
})

export const { setReatiler, reatilerLogout } = reatilerSlice.actions
export default reatilerSlice.reducer;