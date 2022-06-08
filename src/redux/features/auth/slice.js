import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { serviceGet, servicePost } from "../../../utlis/api";
import { deleteHeader, setHeader } from "../../../utlis/header";

const initialState = {
    token: null,
    isAuthenticated: false,
    user: null
  };
  
  export const login = createAsyncThunk("auth/login", async (values) => {
    try {    
        const res = await servicePost('auth/signin', { credentials: {...values }})
        const {  user,token , success } = res
        if(success){

            const { userName = '' } = user
            toast.success(`Hey ${userName} Welcome back`,{
                duration:4000
            })
            // store token
            localStorage.setItem('token', token)
           
            setHeader('auth', `bearer ${token}`);
            console.log(user)
         
            return {
                token,
                user:{...user,userName},
                isAuthenticated:true
            }
        }
       
        return {
            token:null,
            user:null,
            isAuthenticated: false
        }
    } catch (error) {
      
        toast.error(error.response.data.message, {
            duration: 4000
            
        })
       
        deleteHeader('auth');
        deleteHeader()
        return {
            token:null,
            user:null,
            isAuthenticated: false
        }
    }
});
  export const signup = createAsyncThunk("auth/signup", async (values) => {
    try {    
        const res = await servicePost('auth/signup', { credentials: {...values }})
        const {  user,token , success } = res
        if(success){

            const { userName = '' } = user
            toast.success(`Hey ${userName} Welcome `,{
                duration:4000
            })
            // store token
            localStorage.setItem('token', token)
           
            setHeader('auth', `bearer ${token}`);
            console.log(user)
         
            return {
                token,
                user:{...user,userName},
                isAuthenticated:true
            }
        }
       
        return {
            token:null,
            user:null,
            isAuthenticated: false
        }
    } catch (error) {
        console.log({error});
        toast.error(error.response.data.message, {
            duration: 4000
            
        })
       
        deleteHeader('auth');
        deleteHeader()
        return {
            token:null,
            user:null,
            isAuthenticated: false
        }
    }
});

export const loadUser = createAsyncThunk("auth/loadUser", async () => {
    
    try {
        const token = localStorage.getItem('token')
        const {user} = await serviceGet(`auth/loaduser`,{auth: `bearer ${token}`}) // header has token
       if(user){
        //    axios.defaults.headers.common['auth'] = `bearer ${token}`;
        console.log(user);
        setHeader('auth', `bearer ${token}`);
           return {
               token, user, isAuthenticated: true
           }
       } 
       return {token:null,user:null,isAuthenticated:false}
    } catch (error) {
        // delete axios.defaults.headers.common['auth'];
        deleteHeader('auth');
        return {
            token:null, user:null, isAuthenticated: false
        }
    }
});


const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout(state, action) {
            localStorage.removeItem('token');
            // delete axios.defaults.headers.common['auth'];
            deleteHeader('auth');    //add later
            state.token = null
            state.user = null
            state.isAuthenticated = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                const {token,user,isAuthenticated} = action.payload
                state.token = token
                state.user = user
                state.isAuthenticated = isAuthenticated
               
            })
            .addCase(login.rejected,(state,action)=>{
                state.token = null
                state.user = null
                state.token.isAuthenticated=false
                
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                const { token, user, isAuthenticated } = action.payload
                state.token = token
                state.user = user
                state.isAuthenticated = isAuthenticated
                
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.token = null
                state.user = null
                state.isAuthenticated = false
                
            })
           
    },
})

export const { logout } = authSlice.actions;


export default authSlice.reducer;