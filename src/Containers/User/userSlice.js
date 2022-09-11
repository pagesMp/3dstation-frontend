import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import jwt from 'jwt-decode';

export const userSlice = createSlice({
    //Nombre que tiene el slice
    name: 'user',
    initialState: {
        token:""
    },

    //El reducer login recibe un estado y una accion, el estado sera la copia del estado anterior, la accion son los nuevos datos que estan entrando que se ejecutan con .payload
    reducers: {
        login: (state,action) => {
            return {
                ...state,
                ...action.payload
            }
        },
        //El reducer logout recibe un estado y una accion, solo se ejecutara el estado que sera = que el initialState osea sin token
        logout: (state,action) => {
            return{
                token: ""
            }
        },
        update:(state,action) => {
            return{
                ...state,
                ...action.payload
            }
        }
    },
});

export const decodeJWT = (token) => {
    return jwt(token);
}

//Exporto loginUser (necesito que me la expliquen)
export const loginUser = (body) => async (dispatch) => {

    try {
        //Utilizo axios
        const user = await axios.post("https://dimension3-backend.herokuapp.com/api/login", body)

        //Decodifico el token
        let decodificada = jwt(user.data.token)

        //Si me devuelve un 200 hago el login y decodifico el token.
        if(user.status === 200){
            dispatch(login({...decodificada, token: user.data.token}))
            return user.data;
        }

    } catch (error) {
        //Como retorno este error en un setMsgError?
        return error.response.data.success;
    }
}

//Exporto logOut que simplemente me devuelve el initialState del token y a si permite que el usuario se desloguee
export const logOut = () => (dispatch) => {
    dispatch(logout())
}

//Exporto los reducers login,logout
export const {login,logout,update} = userSlice.actions;

//No entiendo bien esta linea
export const userData = (state) => state.user;

//Exporto el nuevo slice llamado "userSlice"
export default userSlice.reducer
