import React, { Component } from "react";
import './Main.css';
import { withRouter } from 'react-router-dom';
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { ThemeConsumer } from "styled-components";
import { initializeApp } from "@firebase/app";
import { Database, getDatabase, onValue, query, ref } from "@firebase/database";
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import '../index.js';
import { database } from "../index.js";

class Main extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            profileURL: ""
        };

        const auth = getAuth();

        console.log(auth.currentUser.name);
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
        this.clickProfile = this.clickProfile.bind(this);
        this.clickMenu = this.clickMenu.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }


    getUsers(searchedTerm) {
        const db = database;
        const q = ref(db, 'users/googleToken');
        onValue(q, (snapshot) => {
            const data = snapshot.val;
            console.log(data);
        })
        //console.log(q);
    }

    clickMenu() {
        let sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("open");
    }

    clickProfile() {
        // const auth = getAuth();
        this.props.history.push('/account_details');
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
                            <input type="text" placeholder="Search..." onClick={this.getUsers} />
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
                            <a href="/account_details">
                                <i class='bx bx-user' ></i>
                                <span class="links_name">Profile</span>
                            </a>
                            <span class="tooltip">Profile</span>
                        </li>
                        <li>
                            <a href="#">
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