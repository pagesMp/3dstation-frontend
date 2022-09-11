import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderView from '../../../All/Header/Header';

import '../../Home/Home.scss';
import '../../Forms.scss';

const UploadProject = () => {

    const userCache = localStorage.getItem('user')
    const user = userCache ? JSON.parse(userCache).user : undefined;
    const token = userCache ? JSON.parse(localStorage.getItem('user')).token : undefined;

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

    const updateProjectData = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value })
    }

    useEffect(() => {

    }, [])

    useEffect(() => {

    })

    const Create = async () => {

        try {
            let datos = ['title', 'description', 'tags', 'images', 'files'];
            let datosToArrays = ['tags', 'images', 'files'];

            for (let field of datos) {
                if (projectData[field] === '') {
                    setMsgError(`${[field]} no puede estar vacío.`);
                    return;
                }
                if (datosToArrays.includes(field)) {
                    let newProjectData = projectData[field].replace(/\s+/g, '');
                    var newProjectDataArray = [];
                    if (newProjectData.indexOf(',') > -1) { 
                        newProjectDataArray = newProjectData.split(',') ;
                    }
                    else {
                        newProjectDataArray = [newProjectData];
                    }
                    projectData[field] = newProjectDataArray;
                }
            }


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