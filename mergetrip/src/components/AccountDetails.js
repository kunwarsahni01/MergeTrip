import React, { Component } from "react";
import './HomePage.css';
import { withRouter } from 'react-router-dom';
import leftBoarding from './BoardingLeft.svg'
import rightBoarding from './BoardingRight.svg'

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
            name: "",
            profileURL: ""
        };
  }

  render() {
    return (
      <div className="HomePage">
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <header className="HomePage-header">
          USER INFO
          <span className="HomePage-subtitle">Information Here</span>
        </header>
      </div>
    );
  }

}



export default withRouter(HomePage);