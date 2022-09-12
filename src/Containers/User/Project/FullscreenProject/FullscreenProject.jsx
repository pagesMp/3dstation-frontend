import React, { Component } from "react";
import axios from 'axios';
import Slider from "react-slick";
import ArtistNameView from '../../../All/ArtistName/ArtistName';

export default class FullscreenProjectView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: undefined
        };
    }

    render() {

        //obtenemos la cache del local storage 
        const userCache = localStorage.getItem('user')
        //si existe la cache, la parseamos y cogemos el user, si no, lo ponemos en undefined
        const user = userCache ? JSON.parse(userCache).user : undefined;
        //si existe la cache, la parseamos y cogemos el token, si no, lo ponemos en undefined
        const token = userCache ? JSON.parse(userCache).token : undefined;

        //añadimos una visita al proyecto por id
        const addView = async (projectId) => {
            try {
                await axios.get("https://dimension3-backend.herokuapp.com/api/public/project/" + projectId + "/add/view");
                return true;
            }
            catch (error) {
                return false;
            }
        }
        //añadimos un like al proyecto por id
        const addLike = async (projectId) => {
            try {
                await axios.post("https://dimension3-backend.herokuapp.com/api/project/" + projectId + "/likes/add", {}, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                alert("Has dado me gusta al proyecto.")
                return true;
            }
            catch (error) {
                alert("Ya has dado me gusta a este proyecto o ha ocurrido un error al hacerlo.")
                return false;
            }
        }

        //obtenemos un proyecto por id
        const getProject = async (projectId) => {
            try {
                const project = await axios.get("https://dimension3-backend.herokuapp.com/api/public/project/get/" + projectId);
                return project;
            }
            catch (error) {
                console.error("Ha ocurrido un error al cargar el proyecto.", error);
                return false;
            }
        }

        //definimos la propiedad proyecto id
        const settings = {
            projectId: this.props.projectId
        };

        //configuración del carousel
        const sliderSettings = {
            infinite: false,
            rows: 2,
            slidesPerRow: 2,
            slidesToShow: 2
        };

        //llamamos la funcion añadir visita al proyecto
        addView(settings.projectId);

        //creamos la galeria, donde type es una imagen o ficheros3D
        const renderGallery = (type, projectImages) => {
            let gallery = [];
            for (let i = 0; i < projectImages.length; i++) {
                //si es imagen, creamos un elemento img
                if (type === "images") {
                    gallery.push(
                        <img key={i} src={projectImages[i]} alt="" className="gallery-item" draggable={false}></img>
                    );
                }
                // si es un fichero3D, creamos un iframe
                else if (type === "files") {
                    gallery.push(
                        <div class="sketchfab-embed-wrapper">
                            <iframe frameborder={"0"} allowfullscreen mozallowfullscreen={"true"} webkitallowfullscreen={"true"} allow={"autoplay; fullscreen; xr-spatial-tracking"} xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share width={"250"} height={"250"} src={projectImages[i]}>
                            </iframe>
                        </div>
                    );
                }
            }
            return gallery;
        };

        //creamos el elemento en html a partir de la llamada a la api
        const renderProjectScreen = () => {
            let projectCard = [];
            //si el perfil esta obtenido
            if (this.state.project) {
                projectCard.push(
                    <div className="book-card" key={this.state.project.id} style={{ width: '100%', height: '100%', cursor: 'auto', marginTop: '4em' }}>
                        <div className="content-wrapper">
                            <img
                                src={this.state.project.images[Math.floor(Math.random() * this.state.project.images.length)]}
                                alt=""
                                className="book-card-img"
                                style={{ borderRadius: "10px" }}
                                draggable="false"
                            />
                            <div className="card-content">
                                <div className="book-name">{this.state.project.title}</div>
                                <ArtistNameView profileId={this.state.project.user_id}>
                                </ArtistNameView>
                                <div className="rate">
                                    {
                                        //si el usuario esta loggeado mostramos el boton de addLike
                                        user ?
                                            <a className="rating book-rate" onClick={() => addLike(this.state.project.id)}>Me gusta ❤</a>
                                            :
                                            null
                                    }
                                    <span className="book-voters card-vote"><b>{this.state.project.views}</b> visita(s)</span>
                                    <span className="book-voters card-vote"><b>{this.state.project.likes}</b> me gusta(s)</span>
                                </div>
                                <div className="book-sum card-sum">
                                    {this.state.project.description}
                                </div>
                            </div>
                        </div>

                        <div className="likes">
                            <div className="like-name" style={{ marginTop: "8px" }}>
                                <b>Etiquetas</b>: {this.state.project.tags.join(", ")}
                            </div>
                        </div>

                        <div className="gallery">
                            <div className="images">
                                <h2 style={{ paddingBottom: "0.2px", userSelect: "none", color: "var(--actionable-color)" }}>Imágenes</h2>
                                <Slider {...sliderSettings}>
                                    {renderGallery("images", this.state.project.images)}
                                </Slider>
                            </div>
                            <div className="files">
                                <h2 style={{ paddingBottom: "0.2em", userSelect: "none", color: "var(--actionable-color)" }}>Vista 3D</h2>
                                <Slider {...sliderSettings}>
                                    {renderGallery("files", this.state.project.files)}
                                </Slider>
                            </div>
                        </div>

                    </div>
                );
            }

            //si el proyecto no existe mostramos un error
            else if (this.state.project === false) {
                projectCard.push(
                    <div key={settings.projectId}>
                        <div className="author-title" style={{ userSelect: "none", textAlign: 'center', padding: "4px", color: "var(--actionable-color)" }}>⚠️ No se ha podido cargar el proyecto indicado.</div>
                    </div>
                );
            }

             //si no hay proyectos, llamamos a la api
            else {
                const getProjectData = getProject(settings.projectId);
                getProjectData.then(result => {
                    //si el resultado no es false, los recupera
                    if (result !== false) {
                        this.setState({ project: result.data.data });
                    }
                    // si no, le pasamos result que equivale a false
                    else {
                        this.setState({ project: result });
                    }
                });
            }

            return projectCard;

        };

        return (
            <div style={{ width: "100%", height: this.state.project !== false ? "100%" : null }}>
                {renderProjectScreen()}
            </div>
        );
    }
}