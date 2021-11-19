import React, { Component, useContext } from 'react';
import './AccountDetails.css';
import { withRouter } from 'react-router-dom';
import { getAuth, updateEmail, deleteUser, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, OAuthProvider, updateProfile } from 'firebase/auth';
import withAuthHOC from './withAuthHOC';
// import leftBoarding from './BoardingLeft.svg'
// import rightBoarding from './BoardingRight.svg'
import { update } from '@firebase/database';
import { AuthContext } from '../firebase';
// import { initializeApp } from '@firebase/app';
// import firebaseConfig from '../index.js'

// const app = fireConfig.initializeApp(firebaseConfig);

class AccountDetails extends Component {
  constructor () {
    super();
    this.state = {
      name: '',
      email: '',
      profileURL: '',
      showUsernameText: false,
      showEmailText: false,
      newUsername: '',
      newEmail: ''
    };

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.showUsername = this.showUsername.bind(this);
    this.showEmail = this.showEmail.bind(this);
    this.deleteAcount = this.deleteAcount.bind(this);
    this.deleteAccountCheck = this.deleteAccountCheck.bind(this);
  }

  componentDidMount () {
    console.log('componentDidMount: ', this.props);

    const auth = this.props.authState.user.auth;

    const defaultName = 'User';
    const defaultProfileURL = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=mp';

    this.setState({
      name: auth.currentUser.displayName ? auth.currentUser.displayName : defaultName,
      profileURL: auth.currentUser.photoURL ? auth.currentUser.photoURL : defaultProfileURL,
      email: auth.currentUser.email
    });
  }

  showEmail () {
    this.setState({
      showUsernameText: false
    });

    this.setState({
      showEmailText: true
    });
  }

  showUsername () {
    this.setState({
      showUsernameText: true
    });

    this.setState({
      showEmailText: false
    });
  }

  onChangeUsername () {
    if (!document.getElementById('usernameTextbox.id')) {
      console.log('NULL!');
      return;
    }

    console.log(document.getElementById('usernameTextbox.id').value);
    const newUsername = document.getElementById('usernameTextbox.id').value;
    // alert("Done!");

    const auth = this.props.authState.user.auth;

    updateProfile(auth.currentUser, { displayName: newUsername })
      .then(() => {
        alert('Username Changed Successfully');
        this.setState({ newUsername: newUsername });
        this.showUsername();
        console.log(auth.currentUser.displayName);
      }).catch((error) => {
        alert("Error: Couldn't change Username");
        console.log(error);
      });
  }

  onChangeEmail () {
    const auth = this.props.authState.user.auth;

    const newEmail = document.getElementById('emailTextbox.id').value;

    updateEmail(auth.currentUser, newEmail)
      .then(() => {
        alert('Email Changed');
        this.showEmail();
        this.setState({ newEmail: newEmail });
        console.log(auth.currentUser.email);
      }).catch(function (error) {
        console.log(error);
      });
  }

  onChangePassword () {
    const auth = this.props.authState.user.auth;
    sendPasswordResetEmail(auth, this.state.email)
      .then((userCredential) => {
        alert('Password Reset Email Sent');
      }).catch(function (error) {
        alert(error);
      });
  }

  deleteAccountCheck () {
    if (window.confirm('Are you sure you want to delete your account?')) {
      this.deleteAcount();
    }
  }

  deleteAcount () {
    const auth = this.props.authState.user.auth;
    deleteUser(auth.currentUser).then(() => {
      alert('Account Deleted');
      this.props.history.push('/');
    }).catch((error) => {
      alert('Delete Account Error');
      console.log(error);
    });
  }

  render () {
    console.log('render props: ', this.props);
    return (
      <div className='AccountDetails'>
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <header className='AccountDetails-header'>
          <img src={this.state.profileURL} alt='profileImg' />
          <div class='text'> Profile Information</div>
          <div className='AccountDetails-subtitle'>
            Username: {this.state.name}
            <br />
            <br />
            Email: {this.state.email}
            <br />
          </div>
          <div>

            <button className='AccountDetails-button' onClick={this.showUsername}>
              Change Username
            </button>

            <button className='AccountDetails-button' onClick={this.showEmail}>
              Change Email
            </button>

            <button className='AccountDetails-button' onClick={this.onChangePassword}>
              Change Password
            </button>

            <br />

            {this.state.showUsernameText
              ? <button className='Reset-button' onClick={this.onChangeUsername}>
                New Username
                </button> : null}

            {this.state.showEmailText
              ? <button className='Reset-button' onClick={this.onChangeEmail}>
                New Email
                </button> : null}

            {this.state.showUsernameText
              ? <input
                // name="username"
                  type='text'
                  id='usernameTextbox.id'
                  placeholder='Username'
                /> : null}

            {this.state.showEmailText
              ? <input
                  type='text'
                  id='emailTextbox.id'
                  placeholder='Email'
                /> : null}
          </div>
          <div>
            <button className='AccountDetails-button' onClick={this.deleteAccountCheck}>
              Delete Account
            </button>
          </div>

        </header>
      </div>
    );
  }
}

export default withRouter(withAuthHOC(AccountDetails));
