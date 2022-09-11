import React, { Component } from "react";

export default class TaggedProjectsMenuView extends Component {
  render() {
    return (
      <div className="main-menu">
        <div className="genre">Popular en...</div>
        <div className="book-types">
          <a href="#" className="book-type active">
            Cualquiera
          </a>
        </div>
      </div>
    );
  }
}