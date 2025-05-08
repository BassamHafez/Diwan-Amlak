import { createSlice } from "@reduxjs/toolkit";

const accountSlice=createSlice({
    name:"accountInfo",
    initialState:{
        data:null,
    },
    
    reducers:{
        setAccountInfo(state,action){
            state.data=action.payload        
        },
    }

})

export default accountSlice;
export const accountActions=accountSlice.actions;