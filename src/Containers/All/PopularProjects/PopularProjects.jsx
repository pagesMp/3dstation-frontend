import React, { Component } from "react";
import axios from 'axios';

export default class PopularProjectsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: undefined
    };
  }

  render() {

    const getPublicProjects = async () => {
      const projects = await axios.get("https://dimension3-backend.herokuapp.com/api/public/projects/get/5");
      return projects;
    }

    const renderProjectsView = () => {
      let projectView = [];
      if (this.state.projects) {
        for (const [key, value] of Object.entries(this.state.projects.data)) {
          let project = this.state.projects.data[key]
          projectView.push(
            <div className="year-book">
              <img
                src={project.images[0]}
                alt=""
                className="year-book-img"
              />
              <div className="year-book-content">
                <div className="year-book-name">{project.title}</div>
                <div className="year-book-author"><b>{project.likes}</b> me gusta(s)</div>
              </div>
            </div>
          );

        }
      }

      else {
        const getProjects = getPublicProjects();
        getProjects.then(result => {
          this.setState({ projects: result.data });
        })
      }

      return projectView;
    };

    return (
      <div className="week year">
        <div className="author-title"><u>Proyectos populares</u></div>
        {renderProjectsView()}
      </div>
    );
  }
}