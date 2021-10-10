import React, { Component } from "react";
import './HomePage.css';
import { withRouter } from 'react-router-dom';

class HomePage extends Component {
  constructor() {
    super();
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    this.redirect();
  }

  redirect() {
    this.props.history.push('/account');
  }

  render() {
    return (
      <div className="HomePage">
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <button className="HomePage-button" onClick={this.onSignUp}>
          Sign Up
        </button>
        <header className="HomePage-header">
          <span className="termina-black-15-3px">MERGETRIP</span>
        </header>
      </div>
    );
  }

}



export default withRouter(HomePage);