import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, userData } from '../userSlice';
import HeaderView from '../../All/Header/Header';

import '../Home/Home.scss';
import '../Forms.scss';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });    
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [msgError, setMsgError] = useState();

    // variables
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const credenciales = useSelector(userData);

    const updateCredentials = (e) => {

        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        if (credenciales?.token !== "") {
            navigate('/');
        }

    }, []);

    useEffect(() => {
        if (credenciales?.token !== "") {
            navigate('/');
        }
    });

    const logueame = () => {

        //Compruebo con una expresion regular si el email tiene arroba y si esta escrito en formato email
        if (! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(credentials.email)) {
            setMsgError('Introduce un e-mail válido');
            return;
        }

        //Compruebo si el password tiene mas de 4 caracteres con una expresion regular
        if (credentials.password.length > 4) {
            if (! /[\d()+-]/g.test(credentials.password)) {
                setMsgError("Introduce un password valido");
                return;
            }
        } else {
            setMsgError("Password minimo de 5 caracteres")
            return;
        }
        //Si tengo algo referenciado como error, lo limpio
        setMsgError("")

        //Utilizo dispatch, el metodo de redux para ejecutar el reducer
        dispatch(loginUser({ email: credentials.email, password: credentials.password })).then(result => {
            if (result === false) {
                setMsgError("Las credenciales introducidas no son correctas.")
                return;
            }
            localStorage.setItem('user', result ? JSON.stringify(result) : null);
            setUser(result);
            
        }).catch(err => {
            setMsgError("Ha ocurrido un error al iniciar sesión.")
            return;
        });
    }

    return (
        <div>
            {/* vista del Header */}
            <HeaderView showSearchBar={false} showMenu={false} justifyContent={true}>
            </HeaderView>

            <div className="container">
                <div className="login-form">
                    <div className="form-header">
                        <h1>¡Hola!</h1>
                        <div className='msg-error'>{msgError}</div>
                    </div>
                    <div className="form-control">
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" name="email" id="email" onChange={updateCredentials} required/>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name="password" id="password" onChange={updateCredentials} required/>
                    </div>
                    <div className="form-footer">
                        <div className="information">
                            <a onClick={() => logueame()}>Iniciar sesión</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;