import React, { Component } from "react";
import axios from 'axios';
import ArtistNameView from "../../../All/ArtistName/ArtistName";

export default class JobOffersView extends Component {

  //inicializamos las propiedades del componente
  constructor(props) {
    super(props);
    this.state = {
      jobs: undefined
    };
  }
  render() {
    //obtenemos la cache del local storage
    const userCache = localStorage.getItem('user');
    //si existe la cache, la parseamos y cogemos el user, si no, lo ponemos en undefined
    const user = userCache ? JSON.parse(userCache).user : undefined;
    //si existe la cache, la parseamos y cogemos el token, si no, lo ponemos en undefined
    const token = userCache ? JSON.parse(userCache).token : undefined;

    const addInterest = async (jobId) => {alert("Has mostrado interés por esta oferta de empleo.")}

    //obtenemos las ofertas de empleo disponibles
    const getJobs = async () => {
      try {
        const jobs = await axios.get("https://dimension3-backend.herokuapp.com/api/jobs/get/all", {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        return jobs;
      }
      catch (error) {
        return false;
      }
    }

    //creamos el elemento en html a partir de la llamada a la api
    const renderJobOffers = () => {
      let jobCards = []; 
      //si se han devuelto jobs
      if (this.state.jobs) {
        //creamos un elemento por job
        for (const [key, value] of Object.entries(this.state.jobs.data)) {
          let job = this.state.jobs.data[key];
          //si el job no esta vacio
          if (job) {
            jobCards.push(
              <div className="book-card" key={job.id}>
                <div className="content-wrapper">                  
                  <div className="card-content">
                    <div className="book-name">{job.title}</div>
                    <ArtistNameView profileId={job.user_id}></ArtistNameView>
                    <div className="rate">
                      {
                        //si el usuario esta loggeado mostramos el boton de addInterest
                        user ?
                          <a className="rating book-rate" onClick={() => addInterest(job.id)}>¡Estoy interesado!</a>
                          :
                          null
                      }
                      <span className="book-voters card-vote"><b>{job.interested}</b> interesado(s)</span>
                    </div>
                    <div className="book-sum card-sum">
                      {job.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }
      }
      //si no se han obtenido ofertas hacemos la llamada a la api
      else {
        const getJobsArray = getJobs();
        getJobsArray.then(result => {
          this.setState({jobs: result.data});
        })
      }

      return jobCards;
    };

    return (
      <div className="book-cards">
        {renderJobOffers()}
      </div>
    );
  }
}