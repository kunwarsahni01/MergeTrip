import './CreateGroup.css'
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAuth } from "firebase/auth";
import { collection, addDoc, getFirestore, setDoc, doc, updateDoc } from "firebase/firestore";

class CreateGroup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            profileURL: "",
            groupName: "",
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.clickMenu = this.clickMenu.bind(this);
        const auth = getAuth();
        console.log(auth.currentUser.displayName);
        this.state.name = auth.currentUser.displayName;
        this.state.profileURL = auth.currentUser.photoURL
        this.onLogout = this.onLogout.bind(this);
        this.onGroup = this.onGroup.bind(this);
        this.createGroup = this.createGroup.bind(this);
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

    onGroup() {
        this.props.history.push('/groups');
    }
    
    onInputchange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    createGroup() {
        const auth = getAuth();
        const userId = auth.currentUser.uid;
        const db = getFirestore();
        setDoc(doc(db, "groups", `${this.state.groupName}`), {
            groupName: this.state.groupName
        });
        setDoc(doc(db, `groups/${this.state.groupName}/members`, userId), {
            uid: userId
        });
        const userRef = doc(db, "users", userId);
        //Update group field of current user in firestore
        updateDoc(userRef, "group", `${this.state.groupName}`);
        this.onGroup();
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
                            <a href="#">
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
                        <li>
                            <a href="#">
                                <i class = 'bx bx-group' onClick={this.onGroup}></i>
                                <span class="links_name">Groups</span>
                            </a>
                            <span class="tooltip">Groups</span>
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
                    <div class="text">Create a new group</div>
                    <div>
                        <input class="group-input"
                            name="groupName"
                            type="text"
                            value={this.state.groupName}
                            placeholder="Enter your group name"
                            onChange={this.onInputchange}
                        />
                    </div>
                    <div>
                        <button class="create-button" onClick={this.createGroup}>Create</button>
                    </div>
                </section>
            </div>
        )
    }
}
export default withRouter(CreateGroup);