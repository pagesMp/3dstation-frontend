import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderView from '../../../All/Header/Header';

import '../../Home/Home.scss';
import '../../Forms.scss';

const UploadJobOffer = () => {

    //obtenemos la cache del local storage
    const userCache = localStorage.getItem('user');
    //si existe la cache, la parseamos y cogemos el user, si no, lo ponemos en undefined
    const user = userCache ? JSON.parse(userCache).user : undefined;
    //si existe la cache, la parseamos y cogemos el token, si no, lo ponemos en undefined
    const token = userCache ? JSON.parse(userCache).token : undefined;

    //HOOK con los datos a rellenar
    const [jobData, setJobData] = useState({
        title: '',
        description: ''
    });

    const [created, setCreated] = useState('');
    const [msgError, setMsgError] = useState('');

    let navigate = useNavigate();

    //HANDLERS 
    const updateJobData = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value })
    }

    //Creamos por primera vez el componente con este useEffect.
    useEffect(() => {

    }, [])

    //Con este useEffect, cada vez que se modifica algo, se actualiza.
    useEffect(() => {

    })

    const Create = async () => {

        try {
            
            //Primero, comprobación de campos vacíos
            let datos = ['title', 'description'];

            for (let field of datos) {
                if (jobData[field] === '') {
                    setMsgError(`${[field]} no puede estar vacío.`);
                    return;
                }
            }

            let uploadProject = await axios.post("https://dimension3-backend.herokuapp.com/api/job/create", jobData, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (uploadProject.status === 200) {

                setCreated(true);

                setTimeout(() => {
                    navigate('/jobs');
                }, 1000);
            }
        }
        catch (error) {
            setMsgError("Ha ocurrido un error inesperado.")
            console.error("Ha ocurrido un error al crear la oferta de empleo.", error)
        }
    }

    if (created === true) {
        return (
            null
        )

    } else {
        return (
            <div>

                {/* Header View */}
                <HeaderView showSearchBar={true} showMenu={true}>
                </HeaderView>

                <div className="container">
                    <div className="login-form">
                        <div className="form-header">
                            <h1>Nueva oferta de empleo</h1>
                            <div className='msg-error'>{msgError}</div>
                        </div>
                        <div className="form-control">
                            <label htmlFor="title">Título</label>
                            <input type="text" name="title" id="title" onChange={updateJobData} required />
                            <label htmlFor="description">Descripción</label>
                            <input type="text" name="description" id="description" onChange={updateJobData} required />
                        </div>
                        <div className="form-footer">
                            <div className="information">
                                <a onClick={() => Create()}>Crear</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UploadJobOffer;