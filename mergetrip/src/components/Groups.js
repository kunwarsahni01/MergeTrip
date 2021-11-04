import './Groups.css'
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, deleteDoc, DocumentSnapshot, setDoc, updateDoc } from 'firebase/firestore';

class Groups extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            profileURL: "",
            groupName: "",
            inviteUid: ""
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.clickMenu = this.clickMenu.bind(this);
        const auth = getAuth();
        console.log(auth.currentUser.displayName);
        this.state.name = auth.currentUser.displayName;
        this.state.profileURL = auth.currentUser.photoURL
        this.onLogout = this.onLogout.bind(this);
        this.onCreate = this.onCreateButton.bind(this);
        this.onInvite = this.onInvite.bind(this);
        this.onLeave = this.onLeave.bind(this);
    }
    onCreateButton() {
        this.toCreate();
    }

    onInvite = async () => {
        //Invite other users
        const db = getFirestore();
        const docref = doc(db, "users", `${this.state.inviteUid}`);
        const docSnap = await getDoc(docref);
        if (docSnap.exists) {
            //Invite user
            alert("Invitation sent");
        } else {
            alert("No user with the userId: " + `${this.state.inviteUid}`);
        }
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

    toCreate() {
        this.props.history.push('/createGroup');
    }
    onInputchange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    onLeave = async () => {
        const auth = getAuth();
        const db = getFirestore();
        const uIdDocSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        alert(uIdDocSnap.get("group"));
        const groupName = uIdDocSnap.get("group");
        if (groupName != null) {
            const docRef = doc(db, `groups/${groupName}/members`, auth.currentUser.uid);
            await deleteDoc(docRef);
            updateDoc(doc(db, "users", auth.currentUser.uid), {
                group: ""
            });
            alert("Successfully left group");
        } else {
            alert("Unable to leave group")
        }
        //const docRef = doc(db, "groups");
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
                                <i class = 'bx bx-group' ></i>
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
                    <div class="text">
                        Groups
                        <button class="create-group-button" onClick={this.onCreate}>
                            New Group
                        </button>
                        <button class="leave-group-button" onClick={this.onLeave}>
                            Leave Group
                        </button>
                    </div>
                    <div>
                        <div>
                            <input class="group-input"
                                name="inviteUid"
                                type="text"
                                value={this.state.inviteUid}
                                placeholder="Enter your group name"
                                onChange={this.onInputchange}
                            />
                        </div>  
                        <div>
                        <button class="invite-button" onClick={this.onInvite}>
                            Invite users
                        </button>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
export default withRouter(Groups);