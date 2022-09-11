import {configureStore} from '@reduxjs/toolkit'
import userSlice from './userSlice';

export default configureStore({
    //El reducer es una funcion pura que toma el estado anterior y una accion, y devuelve el nuevo estado
    reducer: {
        user: userSlice
    }
});