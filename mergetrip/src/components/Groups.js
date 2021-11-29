import './Groups.css'
import React, { Component, useState, useEffect } from 'react';
//import { withRouter } from 'react-router';
//import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, deleteDoc, setDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
//import withAuthHOC from './withAuthHOC';
import CreateGroup from './CreateGroup';
import { useAuthState } from '../firebase';
import Reservation from '../pages/Reservation';
import {getTrips} from '../api/flaskr_api';
import SwitchGroup from './SwitchGroup';
import JoinGroup from './JoinGroup';
import ViewMember from './ViewMember';



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
const Groups = ({props, inviteId}) => {
    const auth = useAuthState();
    //const [groupName, setGroupName] = useState('');
    const [memberUid, setMemUid] = useState('');
    const [inviteUid, setInviteUid] = useState('');
    const [trips, setTrips] = useState(false);
    const [showTrips, setShowTrips] = useState(false);

    const onLeave = async () => {
        //const auth = this.props.authState.user.auth;
        const db = getFirestore();
        const uIdDocSnap = await getDoc(doc(db, "users", auth.user.uid));
        const groupName = uIdDocSnap.get("group");
        if (groupName != null) {
            const docRef = doc(db, `groups/${groupName}/members`, auth.user.uid);
        await deleteDoc(docRef);
        updateDoc(doc(db, "users", auth.user.uid), {
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
        //Maybe change to redirect to new page and pass the uid to view
        //Having issues since rerendering means I lost value stored in inviteUid(I think)

    }
    const onCreate = async () => {
        //setCurrentPage(<CreateGroup />);
    }

/*
  clickMenu() {
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("open");
  }


  toCreate() {
    // this.props.history.push('/createGroup');
    this.props.setCurrentPage(<CreateGroup />)

  onLogout() {
    const auth = this.props.authState.user.auth;
    auth.signOut();
    this.props.history.push('/');

  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }*/

    useEffect(() => {
        const userId = auth.user.uid;
        /*
        alert("in UseEffect");
        if (view && inviteUid != "") {
            fetchTrips(inviteUid);
        } else {
            //alert("Eval false");
            alert(view);
            alert(inviteUid);
            fetchTrips(userId);
        }*/
        if (!trips) fetchTrips(userId);
    }, []);

    const fetchTrips = async (userId) => {
        console.log('Fetching trips:\n');

        const res = await getTrips(userId);
        setTrips(res.data.trips);
    };    

  //render() {
    return (
      <>
        <style>
            @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <br/>
        <header class="text">
            Groups
        </header>

        <h2>
            <button class="leave-group-button" onClick={onLeave}>
                Leave Group
            </button>
            {/*
            <button class="create-button" onClick={() => props.setCurrentPage(<CreateGroup setCurrentPage={props.setCurrentPage()}/>)}>
                Create Group
            </button>
            <button class="switch-button" onClick={() => props.setCurrentPage(<SwitchGroup />)}>
                Switch Groups
            </button>
            <button class="join-button" onClick={() => props.setCurrentPage(<JoinGroup />)}>
                Join Group
            </button>
        */}
            <br/>
        </h2>
        <br />
        <br />
        <div>
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
            {/*Need to also pass groupName*/}
            <button class="view-button" onClick={() => props.setCurrentPage(<ViewMember setCurentPage={props.setCurrentPage()} inviteID={inviteUid}/>)}>
                View
            </button>
                {
                trips  
                    ? trips.map((trip, index) => (
                        <div key={index} className='Trip-container'>
                            <div className='Trip-header'>
                                <p>{trip.trip_name}</p>
                            </div>
                            <div className='Trip-body'>
                                <p>Start: {trip.start_date}</p>
                                <p>End: {trip.end_date}</p>
                            </div>
                            <p>Reservations:</p>
                            <button className='Trip-button' type='button' onClick={() => { setShowTrips(prevShow => !prevShow); }}>Toggle Reservations</button>
                            {
                                showTrips && trip.reservations.length !== 0
                                    ? trip.reservations.map((res, index) => <Reservation fetchTrips={fetchTrips} res={res} userId={trip.user_id} tripId={trip.trip_id} key={index} />)
                                    : <p>Click the button to hide/show your reservations</p>
                            }
                        </div>
                    ))
                    : <p>No Trips planned</p>
                }

        </div>
      </>
    );
 // }
}
//export default withRouter(withAuthHOC(Groups));
export default Groups;