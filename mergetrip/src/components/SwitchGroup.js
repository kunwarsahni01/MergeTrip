import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAuth } from "firebase/auth";
import withAuthHOC from './withAuthHOC';
import { collection, getFirestore, setDoc, doc, updateDoc, getDoc, deleteDoc, getDocs } from "firebase/firestore";
import Groups from './Groups';

class SwitchGroup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            profileURL: "",
            groupName: "",
        };
        this.onInputchange = this.onInputchange.bind(this);
        const auth = getAuth();
        this.state.name = auth.currentUser.displayName;
        this.state.profileURL = auth.currentUser.photoURL
        this.onGroup = this.onGroup.bind(this);
        this.switchGroup = this.switchGroup.bind(this);
    }

    componentDidMount() {
        const auth = this.props.authState.user.auth;
        const defaultName = 'User';
        const defaultProfileURL = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=mp';

        this.setState({
            name: auth.currentUser.displayName ? auth.currentUser.displayName : defaultName,
            profileURL: auth.currentUser.photoURL ? auth.currentUser.photoURL : defaultProfileURL,
        });
    }

    onGroup() {
        this.props.setCurrentPage(<Groups setCurrentPage={this.props.setCurrentPage}/>);
    }
    
    onInputchange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    switchGroup = async () => {
        //this.state.groupName = group to join
        //groupName = old group
        const auth = getAuth();
        const userId = auth.currentUser.uid;
        const db = getFirestore();
        const uIdDocSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        const groupName = uIdDocSnap.get("group");
        if (groupName != null && groupName.length > 0
            && this.state.groupName != null && this.state.groupName.length > 0) {
            //Current user is in a group
            //Check if user if on invited list for new group
            const docref = doc(db, `groups/${this.state.groupName}/invited`, userId);
            const docSnap = await getDoc(docref);
            if (docSnap.exists()) {       //User allowed to join new group
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
                const ref = doc(db, 'groups', this.state.groupName);
                const snap = await (getDoc(ref));
                if (snap.exists()) {
                    //Group does exist, user cannot join, do nothing
                    alert("You have not been invited to join this group");
                } else {
                    //Group did not exist, create and add current user to new group
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
                    setDoc(doc(db, 'groups', this.state.groupName), {
                        groupName: this.state.groupName
                    });
                    setDoc(doc(db, `groups/${this.state.groupName}/members`, userId), {
                        uid: userId
                    });
                    const userRef = doc(db, 'users', userId);
                    updateDoc(userRef, 'group', this.state.groupName);
                    alert("Group did not exist, we created it for you!");
                    console.log("Created Group from SwitchGroup");
                    this.onGroup();
                }
            }
        } else {
            //Current user does not have group field listed in firestore
            alert("Unable to leave group");
        }
    }

    render() {
        return (
            <div>
                <header class="header-text">
                    Switch Groups
                </header>
                <div class="input-section">
                    <input class="group-input"
                        name="groupName"
                        type="text"
                        value={this.state.groupName}
                        placeholder="Enter the name of the group you wish to join"
                        onChange={this.onInputchange}
                    />
                    <button class="switch-button" onClick={this.switchGroup}>
                        Switch
                    </button>
                </div>
            </div>
        )
    }
}
export default withRouter(withAuthHOC(SwitchGroup));