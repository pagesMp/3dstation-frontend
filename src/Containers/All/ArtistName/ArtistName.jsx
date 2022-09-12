import React, { Component } from "react";
import axios from 'axios';

export default class ArtistNameView extends Component {
    //inicializamos las propiedades del componente
    constructor(props) {
        super(props);
        this.state = {
            profile: this.state ? this.state.profile : undefined
        };
    }

    render() {
        //obtenemos la cache del local storage 
        const userCache = localStorage.getItem('user')
        //si existe la cache, la parseamos y cogemos el user, si no, lo ponemos en undefined
        const user = userCache ? JSON.parse(userCache).user : undefined;
        const userIdsCache = localStorage.getItem('userIds');
        //si existe la cache, la parseamos y cogemos la array con los id y nombres de usuario
        let userIds = userIdsCache ? JSON.parse(userIdsCache) : {};

        //obtenemos el perfil mediante el user Id
        const getUserProfile = async (userId) => {
            try {
                const profile = await axios.get("https://dimension3-backend.herokuapp.com/api/public/profile/" + userId);
                return profile;
            }
            catch (error) {
                return false;
            }
        }

        //definimos la propiedad profile id
        const settings = {
            profileId: this.props.profileId
        };

        //creamos el elemento en html a partir de la llamada a la api
        const renderArtistName = () => {
            let artistName = [];
            //si el perfil esta obtenido
            if (this.state.profile) {
                artistName.push(
                    <div className="book-author" key={settings.profileId}><small>Artista: <a href={"/profile/" + settings.profileId}>{this.state.profile.name}</a></small></div>
                );
            }
            else {
                //si el usuario esta loggeado y su id es igual al id solicitado
                if (user && user.id == settings.profileId) {
                    this.setState({ profile: user });
                }
                //si el id solicitado esta en la cache
                else if (settings.profileId in userIds) {
                    this.setState({ profile: userIds[settings.profileId] });
                }
                //si el id solicitado no esta en la cache y no es el usuario loggeado
                else {
                    const getProfile = getUserProfile(settings.profileId);
                    getProfile.then(result => {
                        //si la cache no esta vacia
                        if (userIds.length > 0) {
                            userIds = { ...userIds };
                        }
                        //si la llamada a la api ha devuelto un resultado 
                        else if (result.data) {
                            userIds[settings.profileId] = result.data.data;
                            localStorage.setItem('userIds', JSON.stringify(userIds));
                            this.setState({ profile: result.data.data });
                        }
                        //si la llamada a la api ha devuelto false
                        else {
                            this.setState({ profile: {'name': 'Desconocido'} });
                        }
                    });
                }
            }

            return artistName;
        }

        return (
            <div>
                {renderArtistName()}
            </div >
        );
    }
}