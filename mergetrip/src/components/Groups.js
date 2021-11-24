import './Groups.css'
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, deleteDoc, deleteField, getDocs, collection, updateDoc } from 'firebase/firestore';
import withAuthHOC from './withAuthHOC';

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
    this.onCreate = this.onCreateButton.bind(this);
    this.onInvite = this.onInvite.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.onSwitch = this.onSwitch.bind(this);
    this.onJoin = this.onJoin.bind(this);
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

  onCreateButton() {
    this.toCreate();
  }

  toCreate() {
    //this.props.history.push('/createGroup');
    this.props.setCurrentPage(<CreateGroup />);
  }

  onSwitch() {
    this.toSwitch();
  }

  toSwitch() {
    this.props.setCurrentPage(<SwitchGroup />);
  }

  onJoin() {
    this.toJoin();
  }

  toJoin() {
      this.props.setCurrentPage(<JoinGroup />);
  }

  onLeave = async () => {
    const auth = this.props.authState.user.auth;
    const db = getFirestore();
    const uIdDocSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const groupName = uIdDocSnap.get("group");
    if (groupName != null) {
      const docRef = doc(db, `groups/${groupName}/members`, auth.currentUser.uid);
      await deleteDoc(docRef);
      updateDoc(doc(db, "users", auth.currentUser.uid), {
        group: ""
      });
      var count = 0;
      const querySnap = await getDocs(collection(db, `groups/${groupName}/members`));
      querySnap.forEach((doc) => {
        count++;
      });
      if (count == 0) {
        await deleteDoc(doc(db, "groups", groupName));
      }
      alert("Successfully left group");
    } else {
      alert("Unable to leave group")
    }
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
    const auth = this.props.authState.user.auth;
    auth.signOut();
    this.props.history.push('/');
  }



  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }



  render() {
    return (
      <>
        <div class="text">
            Groups
            <button class="join-group-button" onClick={this.onJoin}>
                Join a Group
            </button>
            <button class="create-group-button" onClick={this.onCreate}>
                Create New Group
            </button>
            <button class="leave-group-button" onClick={this.onLeave}>
                Leave Group
            </button>
            <button class="switch-button" onClick={this.onSwitch}>
                Switch Groups
            </button>
        </div>
        <div>
          <div>
            <input class="group-input"
              name="inviteUid"
              type="text"
              value={this.state.inviteUid}
              placeholder="Enter the User Id to invite"
              onChange={this.onInputchange}
            />
          </div>
          <div>
            <button class="invite-button" onClick={this.onInvite}>
              Invite users
            </button>
          </div>

        </div>
      </>
    );
  }
}
export default withRouter(withAuthHOC(Groups));