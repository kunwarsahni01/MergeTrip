import { getAuth } from 'firebase/auth';
import { useAuthState } from '../firebase';
import './Main.css';
import React, { Component, useState } from 'react';
import { withRouter } from 'react-router-dom';

const Main = () => {
  // constructor() {
  //   super();
  //   this.state = {
  //     name: "",
  //     profileURL: ""
  //   };
  //   this.clickMenu = this.clickMenu.bind(this);
  //   const auth = getAuth();
  //   console.log(auth.currentUser.displayName);
  //   this.defaultName = "User";
  //   this.defaultProfileURL = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=mp";

  //   this.state.name = auth.currentUser.displayName;
  //   if (this.state.name == null) {
  //     this.state.name = this.defaultName;
  //   }

  //   this.state.profileURL = auth.currentUser.photoURL
  //   if (this.state.profileURL == null) {
  //     this.state.profileURL = this.defaultProfileURL;
  //   }

  //   this.onLogout = this.onLogout.bind(this);
  // }

  const auth = useAuthState();

  const DEFAULT_PROFILE_URL = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=mp';

  const [showBar, setShowBar] = useState(false);
  const toggleShowBar = () => {
    // toggles between true and false
    setShowBar(prevShowBarState => !prevShowBarState);
  };

  // clickMenu() {
  //   let sidebar = document.querySelector(".sidebar");
  //   sidebar.classList.toggle("open");
  // }

  // onLogout() {
  //   const auth = getAuth();
  //   auth.signOut();
  //   this.props.history.push('/');
  // }

  return (
    <div>
      {auth.user ? (
        <>
          <div class={`sidebar ${showBar ? 'open' : ''}`}>
            <style>
              @import url("https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css");
            </style>
            <style>
              @import url("https://use.typekit.net/osw3soi.css");
            </style>
            <div class='logo-details'>
              <div class='logo_name'>MERGETRIP</div>
              <i class='bx bx-menu' id='btn' onClick={toggleShowBar} />
            </div>
            <ul class='nav-list'>
              <li>
                <i class='bx bx-search' />
                <input type='text' placeholder='Search...' />
                <span class='tooltip'>Search</span>
              </li>
              <li>
                <a href='#'>
                  <i class='bx bx-grid-alt' />
                  <span class='links_name'>Trips</span>
                </a>
                <span class='tooltip'>Trips</span>
              </li>
              <li>
                <a href='/profile'>
                  <i class='bx bx-user' />
                  <span class='links_name'>Profile</span>
                </a>
                <span class='tooltip'>Profile</span>
              </li>
              <li>
                <a href='/settings'>
                  <i class='bx bx-cog' />
                  <span class='links_name'>Settings</span>
                </a>
                <span class='tooltip'>Settings</span>
              </li>
              <li class='profile'>
                <div class='profile-details'>
                  <img src={auth.user.photoURL ? auth.user.photoURL : DEFAULT_PROFILE_URL} alt='profileImg' />
                  <div class='name_job'>
                    <div class='name'>{auth.user.displayName}</div>
                  </div>
                </div>
                <i class='bx bx-log-out' id='log_out' onClick={auth.logout} />
              </li>
            </ul>
          </div>

          <section class='home-section'>
            <div class='text'> {auth.user.displayName}'s Trips</div>
          </section>
        </>
      )
        : <p>Loading...</p>}
    </div>
  );
};

export default Main;
