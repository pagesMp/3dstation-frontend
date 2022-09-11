import React, { Component } from "react";

export default class HeaderView extends Component {
    render() {

        const userCache = localStorage.getItem('user')
        const user = userCache ? JSON.parse(userCache).user : undefined;
        const token = userCache ? JSON.parse(userCache).token : undefined;
        const tokenIsExpired = token && Date.now() >= token.exp * 1000 ? true : false;

        if (tokenIsExpired === true) {
            alert("La sesión ha expirado. Es necesario iniciar sesión de nuevo.");
            localStorage.clear()
        }

        const settings = {
            showSearchBar: this.props.showSearchBar,
            showMenu: this.props.showMenu,
            justifyContent: this.props.justifyContent,
            showJobOffers: this.props.showJobOffers,
            showNewItem: this.props.showNewItem
        };
        return (
            <div className="header" style={settings.justifyContent === true ? { justifyContent: "center" } : null}>
                {
                    settings.showSearchBar === true ?
                        <div className="browse">

                            <div className="search-bar">
                                <form action="/search/" method="get">
                                    <input type="text" name="query" placeholder="Buscar proyecto..." />
                                    <input type="submit" style={{ display: "none" }} />
                                </form>
                            </div>
                            {
                                user && user.company === 0 && settings.showNewItem ?
                                    <div className="book-see" style={{ marginTop: "0", height: "1.2em", width: "9em", marginRight: "0.5em" }}><a href="/project/new">Nuevo proyecto...</a></div>
                                    :
                                    null
                            }
                            {
                                user && user.company === 1 && settings.showNewItem ?
                                    <div className="book-see" style={{ marginTop: "0", height: "1.2em", width: "9em", marginRight: "0.5em" }}><a href="/job/new">Nueva oferta...</a></div>
                                    :
                                    null
                            }
                            {
                                settings.showJobOffers === true && user ?

                                    <div className="book-see" style={{ marginTop: "0", height: "1.2em", width: "7em" }}><a href="/jobs">Empleos</a></div>
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                }

                <div className="header-title">
                    <a href="/">dimensión<span>3</span></a>
                </div>
                {
                    settings.showMenu === true ?
                        <div className="profile">
                            {
                                user ?
                                    <a href="/profile" style={{ display: "inline-flex", alignItems: "center" }}>
                                        <div className="user-profile">
                                            <img
                                                src="http://www.mountainheavensella.com/wp-content/uploads/2018/12/default-user.png"
                                                alt=""
                                                className="user-img"
                                            />
                                        </div>
                                        <span style={{ marginRight: "10px" }}>{user.name} ({user.email})</span>
                                    </a>
                                    :
                                    null
                            }
                            <div className="profile-menu">
                                {
                                    user ?
                                        <div className="book-see" style={{ marginTop: "0", height: "1.2em", width: "7em" }}><a href="/logout">Cerrar sesión</a></div>
                                        :
                                        <div>
                                            <div className="book-see" style={{ marginTop: "0", height: "1.2em", width: "7em" }}><a href="/login">Iniciar sesión</a></div>
                                            <div className="book-see" style={{ marginTop: "0", height: "1.2em", width: "7em" }}><a href="/login">Registrar</a></div>
                                        </div>
                                }
                            </div>
                        </div>
                        :
                        null
                }
            </div>
        );
    }
}