import { useAuthState } from '../firebase';
import './Main.css';
import React, { useState } from 'react';
import Trips from '../pages/Trips';
import { useHistory } from 'react-router';
import withAuthHOC from './withAuthHOC';
import AccountDetails from './AccountDetails';
import Groups from './Groups';
import CreateGroup from './CreateGroup';
import SwitchGroup from './SwitchGroup';
import JoinGroup from './JoinGroup';

const Main = () => {
  const DEFAULT_PROFILE_URL = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=mp';
  const auth = useAuthState();
  const history = useHistory();

  const [currentPage, setCurrentPage] = useState(<Trips />);

  const [showBar, setShowBar] = useState(false);
  const toggleShowBar = () => {
    // toggles between true and false
    setShowBar(prevShowBarState => !prevShowBarState);
  };

  const logoutButton = () => {
    auth.logout();
    history.push('/');
  };

  return (
    <div>
      {auth.user
        ? (
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
                  <input type='search' placeholder='Search...' />
                  <span class='tooltip'>Search</span>
                </li>
                <li onClick={() => { setCurrentPage(<Trips />); }}>
                  <a>
                    <i class='bx bx-grid-alt' />
                    <span class='links_name'>Trips</span>
                  </a>
                  <span class='tooltip'>Trips</span>
                </li>
                <li onClick={() => { setCurrentPage(<AccountDetails />); }}>
                  <a>
                    <i class='bx bx-user' />
                    <span class='links_name'>Profile</span>
                  </a>
                  <span class='tooltip'>Profile</span>
                </li>
                <li onClick={() => { setCurrentPage(<Groups />); }}>
                  <a>
                    <i class='bx bx-group' />
                    <span class='links_name'>Groups</span>
                  </a>
                  <span class='tooltip'>Groups</span>
                </li>
                <li onClick={() => { setCurrentPage(<CreateGroup />); }}>
                  <a>
                    <i class='bx bx-group' />
                    <span class='links_name'>Create Group</span>
                  </a>
                  <span class='tooltip'>Create Groups</span>
                </li>
                <li onClick={() => { setCurrentPage(<SwitchGroup />); }}>
                  <a>
                    <i class="bx bx-group" />
                    <span class='links_name'>Switch Group</span>
                  </a>
                  <span class='tooltip'>Switch Groups</span>
                </li>
                <li onClick={() => { setCurrentPage(<JoinGroup />); }}>
                  <a>
                    <i class="bx bx-group" />
                    <span class='links_name'>Join Group</span>
                  </a>
                  <span class='tooltip'>Join Group</span>
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
                  <i class='bx bx-log-out' id='log_out' onClick={logoutButton} />
                </li>
              </ul>
            </div>

            <section class='home-section'>
              <div class='text'> {auth.user.displayName}'s Trips</div>

              {currentPage}
            </section>
          </>
          )
        : <p>Loading...</p>}
    </div>
  );
};

export default withAuthHOC(Main);
