import React, { Component } from "react";
import axios from 'axios';

export default class PopularArtistsView extends Component {

  //inicializamos las propiedades del componente
  constructor(props) {
    super(props);
    this.state = {
      artists: undefined
    };
  }

  render() {

    //obtenemos la cache del local storage 
    const userCache = localStorage.getItem('user');
    //si existe la cache, la parseamos y cogemos el token, si no, lo ponemos en undefined
    const token = userCache ? JSON.parse(userCache).token : undefined;

    //añadimos un follow a un usuario por id
    const addFollow = async (userId) => {
      try {
        await axios.post("https://dimension3-backend.herokuapp.com/api/profile/" + userId + "/follow/add", {}, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        alert("Has seguido al usuario.")
        return true;
      }
      catch (error) {
        alert("Ya has seguido a este usuario o ha ocurrido un error al hacerlo.")
        return false;
      }
    }

    //obtenemos los 10 primeros users
    const getPublicArtists = async () => {
      const artists = await axios.get("https://dimension3-backend.herokuapp.com/api/public/users/get/10");
      return artists;
    }

    //creamos el elemento en html a partir de la llamada a la api
    const renderArtistsView = () => {
      let artistView = [];
      //si se han devuelto usuarios
      if (this.state.artists) {
        //creamos un elemento por usuario
        for (const [key, value] of Object.entries(this.state.artists.data)) {
          let artist = this.state.artists.data[key]
          artistView.push(
            <div className="author" key={key}>
              <img
                src="http://www.mountainheavensella.com/wp-content/uploads/2018/12/default-user.png"
                alt=""
                className="author-img"
              />
              <div className="author-name">{artist.name} [<a href="#" style={{ color: "var(--actionable-color)", textDecoration: "none"}} onClick={() => addFollow(artist.id)}>+</a>]</div>
            </div>
          );

        }
      }
      //si no hay usuarios los pido por la api
      else {
        const getArtists = getPublicArtists();
        getArtists.then(result => {
          this.setState({ artists: result.data });
        })
      }

      return artistView;
    };

    return (
      <div className="week">
        <div className="author-title"><u>Artistas populares</u></div>
        {renderArtistsView()}
      </div>
    );
  }
}