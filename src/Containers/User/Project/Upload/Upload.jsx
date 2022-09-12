import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderView from '../../../All/Header/Header';

import '../../Home/Home.scss';
import '../../Forms.scss';

const UploadProject = () => {

    //obtenemos la cache del local storage
    const userCache = localStorage.getItem('user');
    //si existe la cache, la parseamos y cogemos el user, si no, lo ponemos en undefined
    const user = userCache ? JSON.parse(userCache).user : undefined;
    //si existe la cache, la parseamos y cogemos el token, si no, lo ponemos en undefined
    const token = userCache ? JSON.parse(userCache).token : undefined;

    //HOOK con los datos a rellenar
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        tags: '',
        images: '',
        files: ''
    });

    const [created, setCreated] = useState('');
    const [msgError, setMsgError] = useState('');

    let navigate = useNavigate();
    //HANDLERS  
    const updateProjectData = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value })
    }

    //Creamos por primera vez el componente con este useEffect.
    useEffect(() => {

    }, [])
    //Con este useEffect, cada vez que se modifica algo, se actualiza.
    useEffect(() => {

    })

    const Create = async () => {

        try {
            //Primero, comprobación de campos vacío
            let datos = ['title', 'description', 'tags', 'images', 'files'];
            let datosToArrays = ['tags', 'images', 'files'];

            for (let field of datos) {
                if (projectData[field] === '') {
                    setMsgError(`${[field]} no puede estar vacío.`);
                    return;
                }
                //comprobamos que el campo este en el array de datosToArrays
                if (datosToArrays.includes(field)) {
                    //eliminamos los espacios en blanco con el replace
                    let newProjectData = projectData[field].replace(/\s+/g, '');
                    //creamos un array vacio
                    var newProjectDataArray = [];
                    //comprobamos si hay comas en el array y separamos los elementos por comas
                    if (newProjectData.indexOf(',') > -1) { 
                        newProjectDataArray = newProjectData.split(',') ;
                    }
                    //si no hay comas metemos el elemento en una array
                    else {
                        newProjectDataArray = [newProjectData];
                    }
                    //metemos el resultado en el array de projectData
                    projectData[field] = newProjectDataArray;
                }
            }

            //creamos un proyecto
            let uploadProject = await axios.post("https://dimension3-backend.herokuapp.com/api/project/create", projectData, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (uploadProject.status === 200) {

                setCreated(true);

                setTimeout(() => {
                    navigate('/project/' + uploadProject.data.data.id);
                }, 1000);
            }
        }
        catch (error) {
            setMsgError("Ha ocurrido un error inesperado.")
            console.error("Ha ocurrido un error al crear el proyecto.", error)
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
                            <h1>Nuevo proyecto</h1>
                            <div className='msg-error'>{msgError}</div>
                        </div>
                        <div className="form-control">
                            <label htmlFor="title">Título</label>
                            <input type="text" name="title" id="title" onChange={updateProjectData} required />
                            <label htmlFor="description">Descripción</label>
                            <input type="text" name="description" id="description" onChange={updateProjectData} required />
                            <label htmlFor="tags">Etiquetas (*)</label>
                            <input type="text" name="tags" id="tags" onChange={updateProjectData} required />
                            <label htmlFor="images">Imágenes (*)</label>
                            <input type="text" name="images" id="images" onChange={updateProjectData} required />
                            <label htmlFor="files">Sketchfab (*)</label>
                            <input type="text" name="files" id="files" onChange={updateProjectData} required />
                        </div>
                        <div className="form-footer">
                            <div className="information">
                                <a onClick={() => Create()}>Crear</a>
                            </div>
                            <small>(*) <u>Separados por coma.</u></small>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UploadProject;