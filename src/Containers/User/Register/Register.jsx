import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../userSlice';
import axios from 'axios';
import HeaderView from '../../All/Header/Header';

import '../Home/Home.scss';
import '../Forms.scss';

const Register = (props) => {

    //HOOK con los datos a rellenar
    const [userDades, setUserDades] = useState({
        name: '',
        email: '',
        password: '',
        company: 0,
    });

    const [registrado, setRegistrado] = useState('');
    const [msgError, setMsgError] = useState('');

    //variable
    let navigate = useNavigate();
    const dispatch = useDispatch();

    //HANDLERS
    const updateUserDades = (e) => {
        setUserDades({ ...userDades, [e.target.name]: e.target.value })
    }

    //Creamos por primera vez el componente con este useEffect.
    useEffect(() => {

    }, [])

    //Con este useEffect, cada vez que se modifica algo, se actualiza.
    useEffect(() => {

    })

    const Registrate = async () => {

        //Primero, comprobación de campos vacíos

        let datos = ['name', 'email', 'password', 'company'];

        for (let field of datos) {
            if (userDades[field] === '') {
                setMsgError(`${[field]} no puede estar vacío.`);
                return;
            }
        }
        //Con esto válidamos que el email este correctamente.
        if (!userDades.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
            setMsgError('El correo electrónico introducido no es válido.');
            return;
        }

        //La pasword tiene que ser de un tamaño especificado, en este caso entre 6 y 10 digitos.
        if (userDades.password.length < 6 || userDades.password.length > 20) {

            setMsgError("La contraseña debe tener entre 6 y 10 dígitos.");
            return;
        }
        //La password requiere un caracter especial.
        if (!userDades.password.match(/^(?=.*[*@!#%&()^~{}]).*$/)) {

            setMsgError("La contraseña debe contener un carácter especial.");
            return;
        }

        //enviamos los datos a la base de datos 
        let intentoRegistro = await axios.post("https://dimension3-backend.herokuapp.com/api/register", userDades);

        //si el registro realizado es correcto, es decir es igual a un 200, nos 
        //redirigira al side Login para que te logees en la web
        if (intentoRegistro.status === 200) {

            setRegistrado(true);

            setTimeout(() => {
                dispatch(loginUser({ email: userDades.email, password: userDades.password }))
                navigate('/');

            }, 1000);
        }
    }

    if (registrado === true) {
        return (
            null
        )

    } else {
        return (
            <div>

            {/* Header View */}
            <HeaderView showSearchBar={false} showMenu={false} justifyContent={true}>
            </HeaderView>

            <div className="container">
                <div className="login-form">
                    <div className="form-header">
                        <h1>¡Hola!</h1>
                        <div className='msg-error'>{msgError}</div>
                    </div>
                    <div className="form-control">
                            <label htmlFor="name">Nombre</label>
                            <input type="text" name="name" id="name" onChange={updateUserDades} required/>
                            <label htmlFor="email">Correo electrónico</label>
                            <input type="email" name="email" id="email" onChange={updateUserDades} required/>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" name="password" id="password" onChange={updateUserDades} required/>
                            <div className="checkbox-group">
                            <input type="checkbox" id="company" name="company" value="1" onChange={updateUserDades} required/>
                            <label className="checkbox" htmlFor="company">¿Eres empresa?</label>
                            </div>
                    </div>
                    <div className="form-footer">
                        <div className="information">
                        <a onClick={() => Registrate()}>Registrar</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Register;