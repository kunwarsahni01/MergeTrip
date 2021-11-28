import './Groups.css'
import React, { Component, useState } from 'react';
import { withRouter } from 'react-router';
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, deleteDoc, setDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import withAuthHOC from './withAuthHOC';
import { useAuthState } from '../firebase';

/*
class Groups extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      profileURL: "",
      groupName: "",
      inviteUid: "",
      viewUid: "",
      display: false
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.clickMenu = this.clickMenu.bind(this);
    //this.onCreate = this.onCreateButton.bind(this);
    this.onInvite = this.onInvite.bind(this);
    this.onLeave = this.onLeave.bind(this);
    //this.onSwitch = this.onSwitch.bind(this);
    //this.onJoin = this.onJoin.bind(this);
    this.onView = this.onView.bind(this);
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
  */
/*
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
*/
const Groups = (props) => {
    const auth = useAuthState();
    const [groupName, setGroupName] = useState('');
    const [memberUid, setMemUid] = useState('');
    const [inviteUid, setInviteUid] = useState('');
  
    const onLeave = async () => {
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

    const onInvite = async () => {
        if (inviteUid === "") {
            alert("Please input the user Id that you would like to invite");
        } else {
            alert(inviteUid);
            //Invite other users
            //const auth = useAuthState();
            const db = getFirestore();
            const docref = doc(db, "users", `${inviteUid}`);
            const docSnap = await getDoc(docref);
            if (docSnap.exists()) {
                //Add user to invited list
                const uIdDocSnap = await getDoc(doc(db, "users", auth.user.uid));
                const groupName = uIdDocSnap.get("group");
                setDoc(doc(db, `groups/${groupName}/invited`, inviteUid), {
                    uid: inviteUid
                });
                alert("Successfully invited user");
            } else {
                alert("No user with the userId: " + `${inviteUid}`);
            }            
        }
    }

    const onView = async () => {
        //Just testing that input is reading correctly
        alert(this.state.viewUid);
        //Set trips to true
        this.setState({display: true})
    }
/*
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
*/


  //render() {
    return (
      <>
        <style>
            @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <br/>
        <div class="text">
            Groups
            <button class="leave-group-button" onClick={onLeave}>
                Leave Group
            </button>
            <br/>
            <input class="invite-input"
              name="inviteUid"
              type="text"
              value={inviteUid}
              placeholder="Enter the User Id to invite"
              onChange={e => setInviteUid(e.target.value)}
            />
            <br/>
            <button class="invite-button" onClick={onInvite}>
              Invite users
            </button>
            <br/>
            <br/>
            <br/>
            <input class="group-input"
                name="viewUid"
                type="text"
                value={memberUid}
                onChange={e => setMemUid(e.target.value)}
            />
            <br/>
            <button class="view-button" onClick={onView}>
                View
            </button>

        </div>
      </>
    );
 // }
}
//export default withRouter(withAuthHOC(Groups));
export default Groups;