import './SwitchGroup.css'
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAuth } from "firebase/auth";
import { collection, addDoc, getFirestore, setDoc, doc, updateDoc, getDoc, deleteDoc, getDocs } from "firebase/firestore";

class SwitchGroup extends Component {
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
        this.switchGroup = this.switchGroup.bind(this);
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

    switchGroup = async () => {
        const auth = getAuth();
        const userId = auth.currentUser.uid;
        const db = getFirestore();
        const uIdDocSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        const groupName = uIdDocSnap.get("group");
        if (groupName != null) {
            //Current user is in a group
            //Check if user if on invited list for new group
            const docref = doc(db, `groups/${this.state.groupName}/invited`, userId);
            const docSnap = await getDoc(docref);
            if (docSnap.exists) {       //User allowed to join new group
                //Remove user from old group
                const ref = doc(db, `groups/${groupName}/members`, auth.currentUser.uid);
                await deleteDoc(ref);
                //Update group field of user
                updateDoc(doc(db, "users", auth.currentUser.uid), {
                    group: ""
                });
                //Delete group if last member is leaving now
                var count = 0;
                const querySnap = await getDocs(collection(db, `groups/${groupName}/members`));
                querySnap.forEach((doc) => {
                count++;
                });
                if (count === 0) {
                    await deleteDoc(doc(db, "groups", groupName));
                }
                //Add user to new group
                await setDoc(doc(db, `groups/${this.state.groupName}/members`, userId), {
                    uid: userId
                });
                const userRef = doc(db, "users", userId);
            
                //Remove user from invited list and add to members
                const docRefTwo = doc(db, `groups/${this.state.groupName}/invited`, userId);
                await deleteDoc(docRefTwo);
                await updateDoc(userRef, "group", `${this.state.groupName}`);
            
                alert(`Successfully joined ${this.state.groupName}`);
                this.onGroup();
            } else {
                alert("You have not been invited to join this group");
            }
        } else {
            //Current user does not have group field listed in firestore
            alert("Unable to leave group");
        }
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
                    <div class="text">Switch Groups</div>
                    <div>
                        <input class="group-input"
                            name="groupName"
                            type="text"
                            value={this.state.groupName}
                            placeholder="Enter the name of the group you wish to join"
                            onChange={this.onInputchange}
                        />
                    </div>
                    <div>
                        <button class="switch-button" onClick={this.switchGroup}>Switch</button>
                    </div>
                </section>
            </div>
        )
    }
}
export default withRouter(SwitchGroup);