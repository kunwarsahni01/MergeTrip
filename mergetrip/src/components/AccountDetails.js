import React, { Component, useContext } from 'react';
import './AccountDetails.css';
import { withRouter } from 'react-router-dom';
import { getAuth, updateEmail, deleteUser, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, OAuthProvider, updateProfile } from 'firebase/auth';
import { getFirestore, setDoc, doc, addDoc, deleteDoc, collection } from "firebase/firestore";
import withAuthHOC from './withAuthHOC';
// import leftBoarding from './BoardingLeft.svg'
// import rightBoarding from './BoardingRight.svg'
import { update } from '@firebase/database';
import { AuthContext } from '../firebase';
// import { initializeApp } from '@firebase/app';
// import firebaseConfig from '../index.js'

// const app = fireConfig.initializeApp(firebaseConfig);

class AccountDetails extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      profileURL: '',
      showUsernameText: false,
      showEmailText: false,
      disconnected: false,
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
    this.disconnectAccount = this.disconnectAccount.bind(this);
    this.connectAccount = this.connectAccount.bind(this);
    this.hideBoth = this.hideBoth.bind(this);
  }

  componentDidMount() {
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

  showEmail() {
    this.setState({
      showUsernameText: false
    });

    this.setState({
      showEmailText: true
    });
  }

  showUsername() {
    this.setState({
      showUsernameText: true
    });

    this.setState({
      showEmailText: false
    });
  }

  onChangeUsername() {
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
        //this.showUsername();
        this.hideBoth();
        console.log(auth.currentUser.displayName);
      }).catch((error) => {
        alert("Error: Couldn't change Username");
        console.log(error);
      });
  }

  hideBoth() {
    this.setState({
      showUsernameText: false
    });

    this.setState({
      showEmailText: false
    });
  }

  onChangeEmail() {
    //const auth = this.props.authState.user.auth;
    const auth = getAuth();

    const newEmail = document.getElementById('emailTextbox.id').value;

    updateEmail(auth.currentUser, newEmail)
      .then(() => {
        alert('Email Changed');
        //this.showEmail();
        this.hideBoth();
        this.setState({ newEmail: newEmail });
        console.log(auth.currentUser.email);
      }).catch(function (error) {
        console.log(error);
        alert("Failed to Update Email!");
      });
  }

  onChangePassword() {
    const auth = this.props.authState.user.auth;
    sendPasswordResetEmail(auth, this.state.email)
      .then((userCredential) => {
        alert('Password Reset Email Sent');
      }).catch(function (error) {
        alert(error);
      });
  }

  deleteAccountCheck() {
    if (window.confirm('Are you sure you want to delete your account?')) {
      this.deleteAcount();
    }
  }

  deleteAcount() {
    const auth = this.props.authState.user.auth;
    const temp_uid = auth.currentUser.uid;
    deleteUser(auth.currentUser).then(() => {
      alert('Account Deleted');
      this.props.history.push('/');
    }).catch((error) => {
      alert('Delete Account Error');
      console.log(error);
    });
  }

  disconnectAccount() {
    const auth = getAuth();
    this.setState({disconnected : false});
    const db = getFirestore();
    const citiesRef = collection(db, "users");

    try {
      setDoc(doc(db, "users", auth.currentUser.uid), { 
        googleToken: null,

      });
      console.log("Deletion of Google Token Successful")
      alert("Disconnected Email Account")
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  connectAccount() {
    this.setState({disconnected : true});

    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const db = getFirestore();
        try {
          setDoc(doc(db, "users", auth.currentUser.uid), { 
            googleToken: token,
          });
          console.log("Document written with ID: ", auth.currentUser.uid);
          alert("Email Connected");
        } catch (e) {
          console.error("Error adding document: ", e);
        }

      }).catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        alert("Incorrect Email or Password");

        // ...
      });
  }

  render() {
    console.log('render props: ', this.props);
    return (
      <div className='AccountDetails'>
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <div className='AccountDetails-container'>
          <img src={this.state.profileURL} alt='profileImg' className='AccountDetails-image' />
          <div className='AccountDetails-subtitle'>
            {this.state.name}
            <br />
            {this.state.email}
          </div>
        </div>
        <div className='AccountDetails-ButtonArray'>
          <button className='AccountDetails-button' onClick={this.showUsername}>
            Change Username
          </button>

          <button className='AccountDetails-button' onClick={this.showEmail}>
            Change Email
          </button>

          <button className='AccountDetails-button' onClick={this.onChangePassword}>
            Change Password
          </button>

          <button className='AccountDetails-button' onClick={this.deleteAccountCheck}>
            Delete Account
          </button>

          {this.state.disconnected 
          ? <button className="AccountDetails-button" onClick ={this.disconnectAccount}>
            Disconnect Email
          </button> : null} 

          {!this.state.disconnected 
          ? <button className="AccountDetails-button" onClick ={this.connectAccount}>
            Connect Email
          </button> : null}

          <br />

        </div>
        {this.state.showUsernameText
          ? <input
            className='Account-input'
            type='text'
            id='usernameTextbox.id'
            placeholder='Username'
          /> : null}

        {this.state.showEmailText
          ? <input
            className='Account-input'
            type='text'
            id='emailTextbox.id'
            placeholder='Email'
          /> : null}

        {this.state.showUsernameText
          ? <button className='AccountDetails-button' onClick={this.onChangeUsername}>
            New Username
          </button> : null}

        {this.state.showEmailText
          ? <button className='AccountDetails-button' onClick={this.onChangeEmail}>
            New Email
          </button> : null}
      </div>
    );
  }
}

export default withRouter(withAuthHOC(AccountDetails));
