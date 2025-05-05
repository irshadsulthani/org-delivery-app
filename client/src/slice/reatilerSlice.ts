import { createSlice } from "@reduxjs/toolkit";
import { IReatilerState } from "../interfaces/reatiler/IReatilerState";


const initialState : IReatilerState = {
    reatiler : null
}

const reatilerSlice = createSlice({
    name:'reatiler',
    initialState,
    reducers:{
        setReatiler(state, action) {
            state.reatiler = action.payload
        },
        reatilerLogout(state){
            state.reatiler = null
        }
    }
})

export const { setReatiler, reatilerLogout } = reatilerSlice.actions
export default reatilerSlice.reducer;