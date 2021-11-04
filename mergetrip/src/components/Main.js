import { getAuth } from 'firebase/auth'
import { useAuthState } from '../firebase'
import './Main.css'
import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

// export const Main = () => {
//     const { user } = useAuthState()

//     return (
//         <>
//             <h1>Welcome {user?.email}</h1>
//             <button onClick={() => signOut(getAuth())}>Sign out</button>
//         </>
//     )
// }

export class Main extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            profileURL: ""
        };
        this.clickMenu = this.clickMenu.bind(this);
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

        this.onLogout = this.onLogout.bind(this);
    }

    clickMenu() {
        let sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("open");
    }

    onLogout() {
        const auth = getAuth();
        auth.signOut();
        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <div class="sidebar">
                    <style>
                        @import url("https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css");
                    </style>
                    <style>
                        @import url("https://use.typekit.net/osw3soi.css");
                    </style>
                    <div class="logo-details">
                        <div class="logo_name">MERGETRIP</div>
                        <i class='bx bx-menu' id="btn" onClick={this.clickMenu} ></i>
                    </div>
                    <ul class="nav-list">
                        <li>
                            <i class='bx bx-search' ></i>
                            <input type="text" placeholder="Search..." />
                            <span class="tooltip">Search</span>
                        </li>
                        <li>
                            <a href="#">
                                <i class='bx bx-grid-alt'></i>
                                <span class="links_name">Trips</span>
                            </a>
                            <span class="tooltip">Trips</span>
                        </li>
                        <li>
                            <a href="/profile">
                                <i class='bx bx-user' ></i>
                                <span class="links_name">Profile</span>
                            </a>
                            <span class="tooltip">Profile</span>
                        </li>
                        <li>
                            <a href="/settings">
                                <i class='bx bx-cog' ></i>
                                <span class="links_name">Settings</span>
                            </a>
                            <span class="tooltip">Settings</span>
                        </li>
                        <li class="profile">
                            <div class="profile-details">
                                <img src={this.state.profileURL} alt="profileImg" />
                                <div class="name_job">
                                    <div class="name">{this.state.name}</div>
                                </div>
                            </div>
                            <i class='bx bx-log-out' id="log_out" onClick={this.onLogout}></i>
                        </li>
                    </ul>
                </div>

                <section class="home-section">
                    <div class="text"> {this.state.name}'s Trips</div>
                </section>
            </div>
        );
    }

}



export default withRouter(Main);