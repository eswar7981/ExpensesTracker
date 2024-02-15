import {createSlice} from '@reduxjs/toolkit'
const initialAuthState={
    login:false,
    token:'',
    premium:false,
};

const authSlice=createSlice({
    name:'authentication',
    initialState:initialAuthState,
    reducers:{
        setLogin(state){
            state.login=!state.login
            if(state.login==false){
                state.token=''
            }
        },
        setToken(state,action){
            state.token=action.payload


        },
        setPremium(state){
            state.premium=true
            console.log(state.premium)
        }

    }
})

export const authActions=authSlice.actions
export default authSlice.reducer;

















