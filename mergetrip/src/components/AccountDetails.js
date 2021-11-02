import React, { Component } from "react";
import './AccountDetails.css';
import { withRouter } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import leftBoarding from './BoardingLeft.svg'
import rightBoarding from './BoardingRight.svg'

class AccountDetails extends Component {
  constructor() {
    super();
    this.state = {
        name: "",
        email: "",
        profileURL: ""
    };

    //this.clickMenu = this.clickMenu.bind(this);
    const auth = getAuth();
    console.log(auth.currentUser.displayName);
    this.defaultName = "User";
    this.defaultProfileURL = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=mp";

    this.state.name = auth.currentUser.displayName;
    if (this.state.name == null) {
        this.state.name = this.defaultName;
    }

    this.state.profileURL = auth.currentUser.photoURL
    if (this.state.profileURL == null) {
        this.state.profileURL = this.defaultProfileURL;
    }

    this.state.email = auth.currentUser.email;
    if (this.state.profileURL == null) {
        this.state.profileURL = "No Email Found";
    }

  }

  render() {
    return (
      <div className="AccountDetails">
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <header className="AccountDetails-header">
          <img src={this.state.profileURL} alt="profileImg" />
          <div class="text"> Profile Information</div>
          <span className="HomePage-subtitle">Username: {this.state.name}</span>
          <span className="HomePage-subtitle">Email: {this.state.email}</span>
        </header>
      </div>
    );
  }

}



export default withRouter(AccountDetails);