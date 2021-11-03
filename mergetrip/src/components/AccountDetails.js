import React, { Component } from "react";
import './AccountDetails.css';
import { withRouter } from 'react-router-dom';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, OAuthProvider, updateProfile } from "firebase/auth";
import leftBoarding from './BoardingLeft.svg'
import rightBoarding from './BoardingRight.svg'
import { update } from "@firebase/database";

class AccountDetails extends Component {
  constructor() {
    super();
    this.state = {
        name: "",
        email: "",
        profileURL: "",
        showUsernameText:false,
        showEmailText:false,
        newUsername: "",
        newEmail: ""
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

    onAuthStateChanged(auth, (user) => {
        if (user) {
          this.loggedIn = true;
          alert("logged!");
        } else {
          // No user is signed in.
          this.loggedIn = false;
          alert("Change!");
        }
      });

    
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.showUsername = this.showUsername.bind(this);
    this.showEmail = this.showEmail.bind(this);
  }

  

  showEmail() {
    this.setState({
        showUsernameText: false
    })

    this.setState({
        showEmailText: true
    })
  }

  showUsername() {
    this.setState({
        showUsernameText: true
    })

    this.setState({
        showEmailText: false
    })
  }

  onChangeUsername() {
    if (!document.getElementById("usernameTextbox.id")) {
        console.log("NULL!");
        return;
    }


    const auth = getAuth();
    if (!auth) {
        alert("Auth NULL!!");
        return;
    }

    if (!this.loggedIn) {
        alert("logged??");
    }


    if (auth.currentUser == null) {
        alert("USER NULL!!");
    }
    console.log(document.getElementById("usernameTextbox.id").value);
    this.state.newUsername = document.getElementById("usernameTextbox.id").value;
    //alert("Done!");
    
    updateProfile(auth.currentUser, {displayName: "Testing"})
    .then(() => {
        alert("Username Changed Successfully");
        this.state.name = this.state.newUsername;
        this.showUsername();
        console.log(auth.currentUser.displayName);
    }).catch((error) => {
        alert("Error: Couldn't change Username");
        console.log(error);
    });
  }

  onChangeEmail() {

  }

  onChangePassword() {
    const auth = getAuth();
    sendPasswordResetEmail(auth, this.state.email)
      .then((userCredential) => {
        alert("Email sent");
      }).catch(function (error) {
        alert(error);
      });
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
            <div className="AccountDetails-subtitle">
                Username: {this.state.name}
                <br />
                <br />
                Email: {this.state.email}
            <br />
            </div>
            <div>

                <button className="AccountDetails-button" onClick={this.showUsername}>
                    Change Username
                </button>

                <button className="AccountDetails-button" onClick={this.showEmail}>
                    Change Email
                </button>

                <button className="AccountDetails-button" onClick={this.onChangePassword}>
                    Change Password
                </button>

                <br />

                {this.state.showUsernameText ? 
                    <button className="Reset-button" onClick={this.onChangeUsername}>
                        New Username
                    </button>: null}

                {this.state.showUsernameText ? 
                    <input 
                        //name="username"
                        type="text"
                        id="usernameTextbox.id"
                        placeholder="Username"
                    /> : null}

                {this.state.showEmailText ? 
                    <input
                        type="text" 
                        id="emailTextbox.id"
                        placeholder="Email"
                    /> : null}
            </div>

        </header>
      </div>
    );
  }

}



export default withRouter(AccountDetails);