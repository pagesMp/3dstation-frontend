import React, { Component } from "react";
import axios from 'axios';
import Slider from "react-slick";
import ArtistNameView from '../../../All/ArtistName/ArtistName';
// import ModelViewerElement from "@google/model-viewer";


export default class FullscreenProjectView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: undefined
        };
    }

    render() {

        const userCache = localStorage.getItem('user')
        const user = userCache ? JSON.parse(userCache).user : undefined;
        const token = userCache ? JSON.parse(userCache).token : undefined;

        const addView = async (projectId) => {
            try {
                await axios.get("https://dimension3-backend.herokuapp.com/api/public/project/" + projectId + "/add/view");
                return true;
            }
            catch (error) {
                return false;
            }
        }

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

        const settings = {
            projectId: this.props.projectId
        };

        const sliderSettings = {
            infinite: false,
            rows: 2,
            slidesPerRow: 2,
            slidesToShow: 2
        };

        addView(settings.projectId);

        const renderGallery = (type, projectImages) => {
            let gallery = [];
            for (let i = 0; i < projectImages.length; i++) {
                if (type === "images") {
                    gallery.push(
                        <img key={i} src={projectImages[i]} alt="" className="gallery-item" draggable={false}></img>
                    );
                }
                else if (type === "files") {
                    gallery.push(
                        <div class="sketchfab-embed-wrapper">
                            <iframe frameborder={"0"} allowfullscreen mozallowfullscreen={"true"} webkitallowfullscreen={"true"} allow={"autoplay; fullscreen; xr-spatial-tracking"} xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share width={"250"} height={"250"} src={projectImages[i]}>
                            </iframe>
                        </div>
                        // <model-viewer src={projectImages[i]} poster={"https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/legacy-fre-image-placeholder-1642515924.png?crop=1xw:1xh;center,top&resize=640:*"} ar-modes={"webxr scene-viewer quick-look"} shadow-intensity={"1"} camera-controls touch-action={"pan-y"}></model-viewer>
                    );
                }
            }
            return gallery;
        };

        const renderProjectScreen = () => {
            let projectCard = [];
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

            else if (this.state.project === false) {
                projectCard.push(
                    <div key={settings.projectId}>
                        <div className="author-title" style={{ userSelect: "none", textAlign: 'center', padding: "4px", color: "var(--actionable-color)" }}>⚠️ No se ha podido cargar el proyecto indicado.</div>
                    </div>
                );
            }

            else {
                const getProjectData = getProject(settings.projectId);
                getProjectData.then(result => {
                    if (result !== false) {
                        this.setState({ project: result.data.data });
                    }
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