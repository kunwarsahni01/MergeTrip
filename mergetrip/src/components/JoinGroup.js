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
        //this.props.history.push('/groups');
        this.props.setCurrentPage(<Groups />);
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
export default withRouter(WithAuthHOC(JoinGroup));