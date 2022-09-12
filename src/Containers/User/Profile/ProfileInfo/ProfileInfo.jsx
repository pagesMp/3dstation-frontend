import React, { Component } from 'react';
import axios from 'axios';

export default class ProfileInfoView extends Component {

  //inicializamos las propiedades del componente
  constructor(props) {
    super(props);
    this.state = {
      profile: undefined
    };
  }

  render() {
    //obtenemos la cache del local storage
    const userCache = localStorage.getItem('user');
    //si existe la cache, la parseamos y cogemos el user, si no, lo ponemos en undefined
    const user = userCache ? JSON.parse(userCache).user : undefined;
    //si existe la cache, la parseamos y cogemos el token, si no, lo ponemos en undefined
    const token = userCache ? JSON.parse(userCache).token : undefined;

    ////añadimos un follow a un usuario por id
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
     // obtenemos el perfil ajeno por id
    const getUserProfile = async (userId) => {
      try {
        const profile = await axios.get("https://dimension3-backend.herokuapp.com/api/public/profile/" + userId);
        return profile;
      }
      catch (error) {
        return false;
      }
    }

    //si es nuestro perfil, cojemos el id de la variable user si no lo cojemos del parametro profile id
    const settings = {
      profileId: this.props.profileId === "me" ? user.id : this.props.profileId
    };

    //necesitamos dos funciones de la vista profile que usan HOOkS por lo que los pasamos como parametro
    const callbacks = {
      updateProfile: this.props.updateProfileCallback,
      updateUserData: this.props.updateUserDataCallback
    }

    //creamos el elemento en html a partir de la llamada a la api
    const renderProfileInfo = () => {
      let profileInfo = [];
      //si se ha devuelto el perfil
      if (this.state.profile) {
        profileInfo.push(
          <div key={settings.profileId}>
            <div className="week">
              <div className="author-title"><u>Datos de perfil</u></div>
              <div className="author">
                <div className="author-name">
                  {
                    //si el usuario esta loggeado y su id es igual al id solicitado mostramos el input
                    user && user.id == settings.profileId ?
                      <input name="name" id="name" placeholder={this.state.profile.name} onChange={callbacks.updateUserData} />
                      :
                      //si no es el usuario loggeado mostramos un texto
                      <div><b>Nombre</b>:<br />{this.state.profile.name}</div>
                  }
                </div>
              </div>

              <div className="author">
                <div className="author-name">
                  {
                    //si el usuario esta loggeado y su id es igual al id solicitado mostramos el input 
                    user && user.id == settings.profileId ?
                      <input name="email" id="email" placeholder={this.state.profile.email} onChange={callbacks.updateUserData} />
                      :
                      //si no es el usuario loggeado mostramos un texto
                      <div><b>Correo electrónico</b>:<br />{this.state.profile.email}</div>
                  }
                </div>
              </div>
            </div>
            {
              //si el usuario esta loggeado y su id es igual al id solicitado mostramos el boton de editar
              user && user.id == settings.profileId ?
                <a className="book-see" style={{ marginLeft: "2em" }} onClick={() => callbacks.updateProfile()}>Editar</a>
                :
                //si no es el usuario loggeado mostramos el boton de seguir
                <a className="book-see" style={{ marginLeft: "2em" }} onClick={() => addFollow(settings.profileId)}>Seguir</a>
            }
          </div>
        );
      }
      //si el perfil no existe mostramos un error
      else if (this.state.profile === false) {
        profileInfo.push(
          <div key={settings.profileId}>
            <div className="week">
              <div className="author-title" style={{ userSelect: "none", padding: "4px", border: "1px solid var(--border-color)", color: "var(--actionable-color)" }}>⚠️ No existe el usuario indicado.</div>
            </div>
          </div>
        );
      }
      //si no hemos obtenido el perfil lo obtenemos
      else {
        // si el usuario eres tu, no llamamos a la api
        if (user && user.id == settings.profileId) {
          this.setState({ profile: user });
        }
        //si no eres tu el usuario, llamamos a la api
        else {
          const getProfile = getUserProfile(settings.profileId);
          getProfile.then(result => {
            //si obtenemos el usuario lo guardamos
            if (result !== false) {
              this.setState({ profile: result.data.data });
            }
            //si no, lo ponemos en false
            else {
              this.setState({ profile: false });
            }
          });
        }
      }

      return profileInfo;
    }

    return (
      <div>
        {renderProfileInfo()}
      </div>
    );
  }
}