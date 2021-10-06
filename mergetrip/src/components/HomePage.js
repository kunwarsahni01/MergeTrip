import React, { Component } from "react";
import logo from './logo.svg';
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
        <header className="HomePage-header">
          <img src={logo} className="HomePage-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button onClick={this.onSignUp}>Sign Up</button>
        </header>
      </div>
    );
  }

}



export default withRouter(HomePage);