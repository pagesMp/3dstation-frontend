import React, { Component } from "react";
import axios from 'axios';
import ArtistNameView from '../../All/ArtistName/ArtistName';


export default class SearchProjectsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: undefined
    };
  }

  render() {

    const userCache = localStorage.getItem('user')
    const user = userCache ? JSON.parse(userCache).user : undefined;
    const token = userCache ? JSON.parse(userCache).token : undefined;

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

    const getProjectsByName = async (query) => {
      try {
        const projects = await axios.get("https://dimension3-backend.herokuapp.com/api/public/projects/search/" + query);
        return projects;
      }
      catch (error) {
        return false;
      }
    }

    const settings = {
      query: this.props.query
    };

    const renderProjectCards = () => {
      let projectCards = [];
      if (this.state.projects) {
        for (let i = 0; i <= this.state.projects.length; i++) {
          let project = this.state.projects[i];

          if (project) {

            projectCards.push(
              <div className="book-card" key={project.id}>
                <div className="content-wrapper">
                  <a href={"/project/" + project.id}>
                    <img
                      src={project.images[0]}
                      alt=""
                      className="book-card-img"
                      style={{ borderRadius: "10px" }}
                      draggable="false"
                    />
                  </a>
                  <div className="card-content">
                    <div className="book-name">{project.title}</div>
                    <ArtistNameView profileId={project.user_id}>
                    </ArtistNameView>
                    <div className="rate">
                      {
                        user ?
                          <a className="rating book-rate" onClick={() => addLike(project.id)}>Me gusta ❤</a>
                          :
                          null
                      }
                      <span className="book-voters card-vote"><b>{project.views}</b> visita(s)</span>
                      <span className="book-voters card-vote"><b>{project.likes}</b> me gusta(s)</span>
                    </div>
                    <div className="book-sum card-sum">
                      {project.description}
                    </div>
                  </div>
                </div>

                <div className="likes">
                  <div className="like-name" style={{ marginTop: "8px" }}>
                    <b>Etiquetas</b>: {project.tags.join(", ")}
                  </div>
                </div>

              </div>

            );

          }

        }

      }

      else if (this.state.projects === false) {
        projectCards.push(
          <div key={settings.projectId}>
            <div className="author-title" style={{ userSelect: "none", padding: "4px", color: "var(--actionable-color)" }}>⚠️ No se han encontrado proyectos con título "<b><u>{settings.query}</u></b>".</div>
          </div>
        );
      }

      else {
        const getProjects = getProjectsByName(settings.query);
        getProjects.then(result => {
          if (result.data.data.length > 0) {
            this.setState({ projects: result.data.data });
          }
          else {
            this.setState({ projects: false });
          }
        })
      }



      return projectCards;
    };

    return (
      <div className="book-cards">
        {renderProjectCards()}
      </div>
    );
  }
}