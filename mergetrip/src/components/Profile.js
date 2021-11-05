import React, { Component, useEffect, useState } from 'react';
import { useAuthState } from '../firebase';
import './Profile.css';
// import { getAuth, updateEmail, deleteUser, onAuthStateChanged, sendPasswordResetEmail, updateProfile } from 'firebase/auth';

const Profile = () => {
  // constructor () {
  //   super();
  //   this.state = {
  //     name: '',
  //     email: '',
  //     profileURL: '',
  //     showUsernameText: false,
  //     showEmailText: false,
  //     newUsername: '',
  //     newEmail: ''
  //   };

  //   // this.clickMenu = this.clickMenu.bind(this);
  //   const auth = getAuth();
  //   console.log(auth.currentUser.displayName);
  //   this.defaultName = 'User';
  //   this.defaultProfileURL = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=mp';

  //   this.state.name = auth.currentUser.displayName;
  //   if (this.state.name == null) {
  //     this.state.name = this.defaultName;
  //   }

  //   this.state.profileURL = auth.currentUser.photoURL;
  //   if (this.state.profileURL == null) {
  //     this.state.profileURL = this.defaultProfileURL;
  //   }

  //   this.state.email = auth.currentUser.email;
  //   if (this.state.profileURL == null) {
  //     this.state.profileURL = 'No Email Found';
  //   }

  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       this.loggedIn = true;
  //       //   alert("logged!");
  //     } else {
  //       // No user is signed in.
  //       this.loggedIn = false;
  //       //   alert("Change!");
  //     }
  //   });

  //   this.onChangeUsername = this.onChangeUsername.bind(this);
  //   this.onChangeEmail = this.onChangeEmail.bind(this);
  //   this.onChangePassword = this.onChangePassword.bind(this);
  //   this.showUsername = this.showUsername.bind(this);
  //   this.showEmail = this.showEmail.bind(this);
  //   this.deleteAcount = this.deleteAcount.bind(this);
  //   this.deleteAccountCheck = this.deleteAccountCheck.bind(this);
  // }

  // showEmail() {
  //   this.setState({
  //     showUsernameText: false
  //   });

  //   this.setState({
  //     showEmailText: true
  //   });
  // }

  // showUsername() {
  //   this.setState({
  //     showUsernameText: true
  //   });

  //   this.setState({
  //     showEmailText: false
  //   });
  // }

  // onChangeUsername() {
  //   if (!document.getElementById('usernameTextbox.id')) {
  //     console.log('NULL!');
  //     return;
  //   }

  //   const auth = getAuth();
  //   if (!auth) {
  //     alert('Auth NULL!!');
  //     return;
  //   }

  //   // if (!this.loggedIn) {
  //   //     alert("logged??");
  //   // }

  //   if (auth.currentUser == null) {
  //     alert('USER NULL!!');
  //   }
  //   console.log(document.getElementById('usernameTextbox.id').value);
  //   this.state.newUsername = document.getElementById('usernameTextbox.id').value;
  //   // alert("Done!");

  //   updateProfile(auth.currentUser, { displayName: this.state.newUsername })
  //     .then(() => {
  //       alert('Username Changed Successfully');
  //       this.state.name = this.state.newUsername;
  //       this.showUsername();
  //       console.log(auth.currentUser.displayName);
  //     }).catch((error) => {
  //       alert("Error: Couldn't change Username");
  //       console.log(error);
  //     });
  // }

  // onChangeEmail() {
  // const auth = getAuth();

  // this.state.newEmail = document.getElementById('emailTextbox.id').value;

  // updateEmail(auth.currentUser, this.state.newEmail)
  //   .then(() => {
  //     alert('Email Changed');
  //     this.showEmail();
  //     this.state.email = this.state.newEmail;
  //     console.log(auth.currentUser.email);
  //   }).catch(function (error) {
  //     console.log(error);
  //   });
  // }

  // onChangePassword() {
  //   const auth = getAuth();
  //   sendPasswordResetEmail(auth, this.state.email)
  //     .then((userCredential) => {
  //       alert('Password Reset Email Sent');
  //     }).catch(function (error) {
  //       alert(error);
  //     });
  // }

  // deleteAccountCheck() {
  //   if (window.confirm('Are you sure you want to delete your account?')) {
  //     this.deleteAcount();
  //   }
  // }

  // deleteAcount() {
  //   const auth = getAuth();
  //   deleteUser(auth.currentUser).then(() => {
  //     alert('Account Deleted');
  //     this.props.history.push('/');
  //   }).catch((error) => {
  //     alert('Delete Account Error');
  //     console.log(error);
  //   });
  // }

  const auth = useAuthState();

  const DEFAULT_PROFILE_URL = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=mp';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!auth.user) return;

    setUsername(auth.user.displayName);
    setEmail(auth.user.email);
  }, []);

  const changeUsername = () => {
    // code in firebase.js as a func and then call here using auth.<func name here>
  };
  const changeEmail = () => {
    // code in firebase.js as a func and then call here using auth.<func name here>
  };
  const changePassword = () => {
    // code in firebase.js as a func and then call here using auth.<func name here>
  };

  const deleteAccount = () => {
    // code in firebase.js as a func and then call here using auth.<func name here>
  };

  return (
    <div className='AccountDetails'>
      {auth.user
        ? (
          <>
            <style>
              @import url("https://use.typekit.net/osw3soi.css");
            </style>
            <header className='AccountDetails-header'>
              <img src={auth.user.photoURL ? auth.user.photoURL : DEFAULT_PROFILE_URL} alt='profileImg' />
              <div class='text'>Profile Information</div>
              <div className='AccountDetails-subtitle'>
                Username: {auth.user.displayName}
                <br />
                <br />
                Email: {auth.user.email}
                <br />
              </div>
              <div>

                <button className='AccountDetails-button' onClick={changeUsername}>
                  Change Username
                </button>

                <button className='AccountDetails-button' onClick={changeEmail}>
                  Change Email
                </button>

                <button className='AccountDetails-button' onClick={changePassword}>
                  Change Password
                </button>

                <br />

                {/* I low key didnt know what the show text stuff was... refactor if this is not how it was */}
                {/* <button className='Reset-button' onClick={this.onChangeUsername}>
                  New Username
                </button>

                <button className='Reset-button' onClick={this.onChangeEmail}>
                  New Email
                </button> */}

                <input
                  // name="username"
                  type='text'
                  id='usernameTextbox.id'
                  placeholder='Enter new username'
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); }}
                />

                <input
                  type='text'
                  id='emailTextbox.id'
                  placeholder='Enter new email'
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); }}
                />
              </div>
              <div>
                <button className='AccountDetails-button' onClick={deleteAccount}>
                  Delete Account
                </button>
              </div>

            </header>
          </>
          )
        : <p>Loading...</p>}
    </div>
  );
};

export default Profile;
