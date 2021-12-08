import './Groups.css';
import '../pages/Trip.css';
import React, { useState, useEffect } from 'react';
import { doc, getDoc, getFirestore, deleteDoc, setDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import CreateGroup from './CreateGroup';
import { useAuthState } from '../firebase';
import Reservation from '../pages/Reservation';
import { getTrips } from '../api/flaskr_api';
import SwitchGroup from './SwitchGroup';
import JoinGroup from './JoinGroup';
import ViewMember from './ViewMember';

const Groups = ({ setCurrentPage }) => {
  const auth = useAuthState();
  const [groupName, setGroupName] = useState(false);
  const [memberUid, setMemUid] = useState('');
  const [inviteUid, setInviteUid] = useState('');
  const [trips, setTrips] = useState(false);
  const [showTrips, setShowTrips] = useState(false);
  const [members, setMembers] = useState(false);
  const [membersNames, setMembersNames] = useState(false);

  const onLeave = async () => {
    const db = getFirestore();
    if (groupName && groupName != null) {
      const docRef = doc(db, `groups/${groupName}/members`, auth.user.uid);
      await deleteDoc(docRef);
      updateDoc(doc(db, 'users', auth.user.uid), {
        group: ''
      });
      let count = 0;
      const querySnap = await getDocs(collection(db, `groups/${groupName}/members`));
      querySnap.forEach((doc) => {
        count++;
      });
      if (count === 0) {
        await deleteDoc(doc(db, 'groups', groupName));
      }
      await getGroupName(auth.user.uid);
      console.log(auth.user.uid + ' left group: ' + groupName);
    } else {
      alert('Unable to leave group');
    }
  };

  const onInvite = async () => {
    if (inviteUid === '') {
      alert('Please input the user Id that you would like to invite');
    } else {
      // Invite other users
      const db = getFirestore();
      const docref = doc(db, 'users', `${inviteUid}`);
      const docSnap = await getDoc(docref);
      if (docSnap.exists()) {
        // Add user to invited list
        setDoc(doc(db, `groups/${groupName}/invited`, inviteUid), {
          uid: inviteUid,
          username: docSnap.get('username'),
        });
        alert('Successfully invited user');
      } else {
        alert('No user with the userId: ' + inviteUid);
      }
    }
  };

  useEffect(() => {
    const userId = auth.user.uid;
    if (!groupName) {
      getGroupName(userId);
    }
    if (!trips) {
      fetchTrips(userId);
    }
  }, []);

  const fetchTrips = async (uId) => {
    console.log('Fetching trips:\n');
    const res = await getTrips(uId);
    setTrips(res);
  };

  const getGroupName = async (userId) => {
    const db = getFirestore();
    const docref = doc(db, 'users', userId);
    const docSnap = await (getDoc(docref));
    if (docSnap.exists()) {
      // get groupName field from docsnap
      const group = docSnap.get('group');
      if (group != null && group.length !== 0) {
        setGroupName(group);
        getGroupMembers(group);
      } else {
        setGroupName(false);
      }
    } else {
      setGroupName(false);
    }
  };

  const getGroupMembers = async (group) => {
    const db = getFirestore();
    const ref = collection(db, `groups/${group}/members`);
    const querySnap = await getDocs(ref);
    const mems = [];
    const memsNames = [];
    querySnap.forEach((doc) => {
      mems.push(doc.get('uid'));
      memsNames.push(doc.get('username'));
    });
    setMembers(mems);
    setMembersNames(memsNames);
  };

  const showMembers = membersNames => {
    const content = [];
    for (let i = 0; i < membersNames.length; i++) {
      const t = membersNames[i];
      content.push(<li key={t.id}>{t}</li>);
    }
    return content;
  };

  return (
    <>
      <style>@import url("https://use.typekit.net/osw3soi.css");</style>
      <header class='header-text'>
        {
          groupName
            ? <p>Current Group: {groupName}</p>
            : <p>You are not currently in a group</p>
        }
      </header>
      <h1 class='member-list'>
        {
          groupName
            ? <>
              <p>Current Members:</p>
              <div>
                {showMembers(membersNames)}
              </div>
              </>
            : <p />
        }
      </h1>
      <h2 class='button-section'>
        {
          groupName
            ? <div>
              <button class='switch-button' onClick={() => { setCurrentPage(<SwitchGroup setCurrentPage={setCurrentPage} />); }}>
                Switch Groups
              </button>
              <button class='leave-group-button' onClick={onLeave}>
                Leave Group
              </button>
              </div>
            : <div>
              <button class='join-button' onClick={() => { setCurrentPage(<JoinGroup setCurrentPage={setCurrentPage} />); }}>
                Join Group
              </button>
              <button class='create-button' onClick={() => { setCurrentPage(<CreateGroup setCurrentPage={setCurrentPage} />); }}>
                Create Group
              </button>
              </div>
        }
      </h2>
      {
        groupName
          ? <div class='input-section'>
            {/* <p>Invite a user to your group with their user ID</p> */}
            <input
              class='invite-input'
              name='inviteUid'
              type='text'
              value={inviteUid}
              placeholder='Enter the User ID to Invite User'
              onChange={e => setInviteUid(e.target.value)}
            />
            <button class='invite-button' onClick={onInvite}>
              Invite users
            </button>
            {/* <p>Enter the User ID of a group member to view their itinerary</p>
            <p>Or simply click 'View' to view you're entire group's itinerary</p> */}
            <input
              class='group-input'
              name='viewUid'
              type='text'
              value={memberUid}
              placeholder='Enter the User ID to view a itinerary'
              onChange={e => setMemUid(e.target.value)}
            />
            <button class='view-button' onClick={() => { setCurrentPage(<ViewMember viewId={memberUid} setCurrentPage={setCurrentPage} groupName={groupName} members={members} />); }}>
              View
            </button>
            <br />
            <h3 class='centered-text'>Your trips</h3>
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
                    {
                      trip.reservations.length !== 0
                        ? <button className='Trip-button' type='button' onClick={() => { setShowTrips(prevShow => !prevShow); }}>Toggle Reservations</button>
                        : <p>No Reservations</p>
                    }
                    {
                      showTrips && trip.reservations.length !== 0
                        ? trip.reservations.map((res, index) => <Reservation hideEdit fetchTrips={fetchTrips} res={res} userId={trip.user_id} tripId={trip.trip_id} key={index} />)
                        : null
                    }
                  </div>
                  ))
                : <p>No Trips planned</p>
            }
            </div>
          : null
      }
    </>
  );
};
export default Groups;
