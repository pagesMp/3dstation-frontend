import React, { Component } from "react";
import Slider from "react-slick";
import '../../slick.min.css';
import '../../slick-theme.min.css';
import axios from 'axios';
import ArtistNameView from '../../All/ArtistName/ArtistName';

export default class StarredProjectsSlider extends Component {
  //inicializamos las propiedades del componente
  constructor(props) {
    super(props);
    this.state = {
      projects: undefined
    };
  }

  render() {

    //obtenemos la cache del localstorage
    const userCache = localStorage.getItem('user')
    //si existe la cache, la parseamos y cogemos el usuario, si no lo ponemos en undefined
    const user = userCache ? JSON.parse(userCache).user : undefined;
    //si existe la cache, la parseamos y cogemos el token, si no lo ponemos en undefined
    const token = userCache ? JSON.parse(userCache).token : undefined;

    //añadimos un like a un proyecto por id
    const addLike = async (projectId) => {
      try {
        await axios.post("https://dimension3-backend.herokuapp.com/api/project/" + projectId + "/likes/add", {} ,{
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
    
    //cogemos los 10 primeros proyectos
    const getPublicProjects = async () => {
      const projects = await axios.get("https://dimension3-backend.herokuapp.com/api/public/projects/get/10");
      return projects;
    }

    //creamos el elemento en html a partir de la llamada a la api
    const renderProjectsView = () => {
      let projectView = [];
      //si se han devuelto proyectos
      if (this.state.projects) {
        //creamos un elemento por proyecto
        for (const [key, value] of Object.entries(this.state.projects.data)) {
          let project = this.state.projects.data[key]
          projectView.push(
            <div className="starred-project" key={key}>
              <div className="book-img">
                <a href={"/project/" + project.id}>
                <img
                  src={project.images[Math.floor(Math.random() * project.images.length)]}
                  alt=""
                  className="book-photo"
                />
                </a>
              </div>
              <div className="book-content">
                <div className="book-title">{project.title}</div>
                <ArtistNameView profileId={project.user_id}>
                </ArtistNameView>
                <div className="rate">
                  {
                    //si el usuario esta logeado mostramos el boton de me gusta
                    user ?
                      <a className="rating book-rate" onClick={() => addLike(project.id)}>Me gusta ❤</a>
                      :
                      null
                  }
                  <span className="book-voters card-vote"><b>{project.views}</b> visita(s)</span>
                  <span className="book-voters card-vote"><b>{project.likes}</b> me gusta(s)</span>
                </div>
                <div className="book-sum">
                  {project.description}
                </div>
                <div className="book-see-container">
                <a href={"/project/" + project.id} style={{ textDecoration: "none" }}><div className="book-see actionable" style={{ height: "1.2em", width: "3em" }}>Ver</div></a>
                </div>
              </div>
            </div>
          );
        }
      }
      //si no hay proyectos los pedimos a la api
      else {
        const getProjects = getPublicProjects();
        getProjects.then(result => {
          this.setState({ projects: result.data });
        })
      }

      return projectView;
    };

    //configuración del carousel
    const sliderSettings = {
      infinite: true,
      swipeToSlide: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      speed: 500
    };

    return (
      <Slider {...sliderSettings}>
        {renderProjectsView()}
      </Slider>
    );
  }
}