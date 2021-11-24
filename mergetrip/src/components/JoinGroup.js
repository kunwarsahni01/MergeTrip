import './JoinGroup.css'
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAuth } from "firebase/auth";
import { doc, deleteDoc, getFirestore, setDoc, updateDoc, getDoc } from 'firebase/firestore';

class JoinGroup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            profileURL: "",
            groupName: ""
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.clickMenu = this.clickMenu.bind(this);
        const auth = getAuth();
        console.log(auth.currentUser.displayName);
        this.state.name = auth.currentUser.displayName;
        this.state.profileURL = auth.currentUser.photoURL
        this.onLogout = this.onLogout.bind(this);
        this.onGroup = this.onGroup.bind(this);
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

    onInputchange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    onGroup() {
        this.props.history.push('/groups');
    }

    onJoin = async () => {
        const auth = getAuth();
        const userId = auth.currentUser.uid;
        const db = getFirestore();

        const docref = doc(db, `groups/${this.state.groupName}/invited`, userId);
        const docSnap = await getDoc(docref);
        if (docSnap.exists) {
            
            await setDoc(doc(db, `groups/${this.state.groupName}/members`, userId), {
                uid: userId
            });
            const userRef = doc(db, "users", userId);
        
            //Remove user from invited list and add to members
            const docRef = doc(db, `groups/${this.state.groupName}/invited`, userId);
            await deleteDoc(docRef);
            await updateDoc(userRef, "group", `${this.state.groupName}`);
        
            alert(`Successfully joined ${this.state.groupName}`);
            this.onGroup();
        } else {
            alert("You have not been invited to join this group");
        }
    }
    onGroup() {
        this.props.history.push('/groups');
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
                    <div>
                        <div class="text">
                            Join an Existing Group
                        </div>
                        <div>
                            <input class="group-input"
                                name="groupName"
                                type="text"
                                value={this.state.groupName}
                                placeholder="Enter the Group Name"
                                onChange={this.onInputchange}
                            />
                        </div>  
                        <div>
                            <button class="join-button" onClick={this.onJoin}>
                                Join Group
                            </button>
                        </div>
                        
                    </div>
                </section>
            </div>
        )
    }
}
export default withRouter(JoinGroup);