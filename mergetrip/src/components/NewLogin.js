import React, { useEffect } from 'react';
import google from './google.svg';
import { useAuthState } from '../firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, OAuthProvider } from 'firebase/auth';
import { useHistory } from 'react-router';

const NewLogin = (props) => {
  const auth = useAuthState();
  const history = useHistory();

  const createGoogle = () => {
    auth.loginWithGoogle()
      .then(() => {
        console.log('LOGIN SUCCESSFUL !');
      })
      .catch(() => {
        console.log('LOGIN FAILED');
      });
  };

  const handleLogout = () => {
    auth.logout()
      .then(() => {
        console.log('LOGIN SUCCESSFUL !');
      })
      .catch(() => {
        console.log('LOGIN FAILED');
      });
  };

  return (
    <div className='Account'>
      <style>
        @import url("https://use.typekit.net/osw3soi.css");
      </style>
      {/* <button className='Account-home' onClick={onHomeButton}>MERGETRIP</button> */}
      <header className='Account-header'>
        {/* <div className='Account-buttons'> */}
        <button className='Account-google' onClick={createGoogle}>
          <img src={google} alt='Google' />
          Log In With Google
        </button>
        <button onClick={handleLogout}>
          logout
        </button>
        {auth.user ? <p>Logged in as: {auth.user.displayName}</p> : <p>Not logged in</p>}
        {/* <button className='Account-apple' onClick={onAppleLogin}>
            <img src={apple} alt='Apple' />
            Log In With Apple
          </button>
        </div>
        <div>
          <input
            className='Account-input'
            name='username'
            type='text'
            value={state.username}
            onChange={onInputchange}
            placeholder='Username'
          />
        </div>
        <div>
          <input
            className='Account-input'
            name='password'
            type='password'
            value={state.password}
            onChange={onInputchange}
            placeholder='Password'
          />
        </div>
        <div className='Account-requirements'>
          * username must exist *
        </div>
        <div className='Account-requirements'>
          * password must be 6 characters long *
        </div>
        <div>
          <button className='Account-button' onClick={onSignUp}>Sign Up</button>
          <button className='Account-button' onClick={onLogin}>Log In</button>
          <button className='Account-button' onClick={onResetPassword}>Reset Password</button>
        </div> */}
      </header>
    </div>
  );
};

export default NewLogin;
