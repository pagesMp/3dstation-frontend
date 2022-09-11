import React, { Component } from "react";
import axios from 'axios';
import ArtistNameView from "../../../All/ArtistName/ArtistName";

export default class JobOffersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: undefined
    };
  }
  render() {

    const userCache = localStorage.getItem('user')
    const user = userCache ? JSON.parse(userCache).user : undefined;
    const token = userCache ? JSON.parse(userCache).token : undefined;

    const addInterest = async (jobId) => {alert("Has mostrado interés por esta oferta de empleo.")}

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

    const renderJobOffers = () => {
      let jobCards = [];
      if (this.state.jobs) {
        for (const [key, value] of Object.entries(this.state.jobs.data)) {
          let job = this.state.jobs.data[key];
          if (job) {
            jobCards.push(
              <div className="book-card" key={job.id}>
                <div className="content-wrapper">                  
                  <div className="card-content">
                    <div className="book-name">{job.title}</div>
                    <ArtistNameView profileId={job.user_id}></ArtistNameView>
                    <div className="rate">
                      {
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