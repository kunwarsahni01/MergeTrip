import './Groups.css';
import '../pages/Trip.css';
import React, { Component, useState, useEffect } from 'react';

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

  const onLeave = async () => {
    const db = getFirestore();
    const uIdDocSnap = await getDoc(doc(db, 'users', auth.user.uid));
    const groupName = uIdDocSnap.get('group');
    if (groupName != null) {
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
      if (count == 0) {
        await deleteDoc(doc(db, 'groups', groupName));
      }
      alert('Successfully left group');
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
        const uIdDocSnap = await getDoc(doc(db, 'users', auth.user.uid));
        const groupName = uIdDocSnap.get('group');
        setDoc(doc(db, `groups/${groupName}/invited`, inviteUid), {
          uid: inviteUid
        });
        alert('Successfully invited user');
      } else {
        alert('No user with the userId: ' + `${inviteUid}`);
      }
    }
  };

  useEffect(() => {
    const userId = auth.user.uid;
    if (!groupName) {
      getGroupName(userId);
    }
    if (!trips) fetchTrips(userId);
  }, []);

  const fetchTrips = async (userId) => {
    console.log('Fetching trips:\n');

    const res = await getTrips(userId);
    setTrips(res);
  };

  const getGroupName = async (userId) => {
    const db = getFirestore();
    const docref = doc(db, 'users', userId);
    const docSnap = await (getDoc(docref));
    if (docSnap.exists) {
      // get groupName field from docsnap
      const group = docSnap.get('group');
      if (group != null) {
        setGroupName(group);
      }
      getGroupMembers(group);
    }
  };

  const getGroupMembers = async (group) => {
    const db = getFirestore();
    const ref = collection(db, `groups/${group}/members`);
    const querySnap = await getDocs(ref);
    const mems = [];
    querySnap.forEach((doc) => {
      mems.push(doc.get('uid'));
    });
    setMembers(mems);
  };
  const showMembers = members => {
    const content = [];
    for (let i = 0; i < members.length; i++) {
      const t = members[i];
      content.push(<li key={t.id}>{t}</li>);
    }
    return content;
  };

  return (
    <>
      <style>
        @import url("https://use.typekit.net/osw3soi.css");
      </style>
      <br />
      <header class='text'>
        {
          groupName
            ? <p>Current Group: {groupName}</p>
            : <p>Join a group first</p>
        }
        {
          groupName
            ? <>
              <p>Current Members:</p>
              <div>
                {showMembers(members)}
              </div>
              </>
            : <p />
        }
      </header>
      <h2>
        <button class='leave-group-button' onClick={onLeave}>
          Leave Group
        </button>
        <button class='create-button' onClick={() => { setCurrentPage(<CreateGroup setCurrentPage={setCurrentPage} />); }}>
          Create Group
        </button>
        <button class='switch-button' onClick={() => { setCurrentPage(<SwitchGroup setCurrentPage={setCurrentPage} />); }}>
          Switch Groups
        </button>
        <button class='join-button' onClick={() => { setCurrentPage(<JoinGroup setCurrentPage={setCurrentPage} />); }}>
          Join Group
        </button>
        <br />
      </h2>
      <br />
      <br />
      <div>
        <input
          class='invite-input'
          name='inviteUid'
          type='text'
          value={inviteUid}
          placeholder='Enter the User Id to invite'
          onChange={e => setInviteUid(e.target.value)}
        />
        <br />
        <button class='invite-button' onClick={onInvite}>
          Invite users
        </button>
        <br />
        <br />
        <br />
        <p>Enter the User ID of the group member to view their itinerary</p>
        <input
          class='group-input'
          name='viewUid'
          type='text'
          value={memberUid}
          onChange={e => setMemUid(e.target.value)}
        />
        <br />
        {/* Need to also pass groupName */}
        <button class='view-button' onClick={() => { setCurrentPage(<ViewMember viewId={memberUid} setCurrentPage={setCurrentPage} groupName={groupName} members={members} />); }}>
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
                    ? trip.reservations.map((res, index) => <Reservation hideEdit fetchTrips={fetchTrips} res={res} userId={trip.user_id} tripId={trip.trip_id} key={index} />)
                    : <p>Click the button to hide/show your reservations</p>
                }
              </div>
              ))
            : <p>No Trips planned</p>
        }
      </div>
    </>
  );
};
export default Groups;
