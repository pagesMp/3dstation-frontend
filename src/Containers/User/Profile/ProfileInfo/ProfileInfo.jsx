import React, { Component } from 'react';
import axios from 'axios';

export default class ProfileInfoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: undefined
    };
  }

  render() {

    const userCache = localStorage.getItem('user')
    const user = userCache ? JSON.parse(localStorage.getItem('user')).user : undefined;
    const token = userCache ? JSON.parse(userCache).token : undefined;

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

    const getUserProfile = async (userId) => {
      try {
        const profile = await axios.get("https://dimension3-backend.herokuapp.com/api/public/profile/" + userId);
        return profile;
      }
      catch (error) {
        return false;
      }
    }

    const settings = {
      profileId: this.props.profileId === "me" ? user.id : this.props.profileId
    };

    const callbacks = {
      updateProfile: this.props.updateProfileCallback,
      updateUserData: this.props.updateUserDataCallback
    }

    const renderProfileInfo = () => {
      let profileInfo = [];
      if (this.state.profile) {
        profileInfo.push(
          <div key={settings.profileId}>
            <div className="week">
              <div className="author-title"><u>Datos de perfil</u></div>
              <div className="author">
                <div className="author-name">
                  {
                    user && user.id == settings.profileId ?
                      <input name="name" id="name" placeholder={this.state.profile.name} onChange={callbacks.updateUserData} />
                      :
                      <div><b>Nombre</b>:<br />{this.state.profile.name}</div>
                  }
                </div>
              </div>

              <div className="author">
                <div className="author-name">
                  {
                    user && user.id == settings.profileId ?
                      <input name="email" id="email" placeholder={this.state.profile.email} onChange={callbacks.updateUserData} />
                      :
                      <div><b>Correo electrónico</b>:<br />{this.state.profile.email}</div>
                  }
                </div>
              </div>
            </div>
            {
              user && user.id == settings.profileId ?
                <a className="book-see" style={{ marginLeft: "2em" }} onClick={() => callbacks.updateProfile()}>Editar</a>
                :
                <a className="book-see" style={{ marginLeft: "2em" }} onClick={() => addFollow(settings.profileId)}>Seguir</a>
            }
          </div>
        );
      }
      else if (this.state.profile === false) {
        profileInfo.push(
          <div key={settings.profileId}>
            <div className="week">
              <div className="author-title" style={{ userSelect: "none", padding: "4px", border: "1px solid var(--border-color)", color: "var(--actionable-color)" }}>⚠️ No existe el usuario indicado.</div>
            </div>
          </div>
        );
      }
      else {
        if (user && user.id == settings.profileId) {
          this.setState({ profile: user });
        }
        else {
          const getProfile = getUserProfile(settings.profileId);
          getProfile.then(result => {
            if (result !== false) {
              this.setState({ profile: result.data.data });
            }
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