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
        const userIdsCache = localStorage.getItem('userIds')
        let userIds = userIdsCache ? JSON.parse(userIdsCache) : {};

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
            profileId: this.props.profileId
        };

        const renderArtistName = () => {
            let artistName = [];
            if (this.state.profile) {
                artistName.push(
                    <div className="book-author" key={settings.profileId}><small>Artista: <a href={"/profile/" + settings.profileId}>{this.state.profile.name}</a></small></div>
                );
            }
            else {
                if (user && user.id === settings.profileId) {
                    this.setState({ profile: user });
                }
                else if (settings.profileId in userIds) {
                    this.setState({ profile: userIds[settings.profileId] });
                }
                else {
                    const getProfile = getUserProfile(settings.profileId);
                    getProfile.then(result => {
                        if (userIds.length > 0) {
                            userIds = { ...userIds };
                        }
                        else if (result.data) {
                            userIds[settings.profileId] = result.data.data
                            localStorage.setItem('userIds', JSON.stringify(userIds));
                            this.setState({ profile: result.data.data });
                        }
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