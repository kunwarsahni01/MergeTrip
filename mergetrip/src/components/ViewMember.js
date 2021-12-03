import './ViewMember.css';
import React, { useEffect, useState } from 'react';
import Groups from './Groups';
import { getTrips } from '../api/flaskr_api';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Reservation from '../pages/Reservation';
import { useAuthState } from '../firebase';

const ViewMember = ({viewId, groupName, setCurrentPage, members}) => {
    const auth = useAuthState();
    const [itineraries, setItin] = useState(false);

    const fetchTrips = async (userId) => {
        const res = await getTrips(userId);
        let itin = [];
        itin.push(res);
        setItin(itin);
    }

    useEffect(() => {
        const userId = auth.user.uid;
        checkMember(userId);
    }, []);

    //fetch member trips if viewId is passed, if not, fetches current user trips
    const checkMember = async (userId) => {
        if (viewId.length === 0) {
            //No id passed, display entire group itinerary
            alert("Displaying entire group's itineraries");
            fetchAll();
        } else {
            const db = getFirestore();
            const docref = doc(db, `groups/${groupName}/members`, viewId);
            const docSnap = await getDoc(docref);
            if (docSnap.exists()) {
                //ID passed is valid, display itinerary
                fetchTrips(viewId);
            } else {
                //Invalid ID passed, display current user's itinerary
                alert("That member does not exist/is not in your group\nNow Displaying your itinerary");
                fetchTrips(userId);
            }
        }
    }

    const fetchAll = async () => {
        let itin = [];
        for (let i = 0; i < members.length; i++) {
            const res = await getTrips(members[i]);
            console.log(res);
            itin.push(res);
        }
        setItin(itin);
    }

    const viewAll = itineraries => {
        let c = [];
        for (let i = 0; i < itineraries.length; i++) {
            c.push(<>{
                itineraries[i]
                    ? itineraries[i].map((trip, index) => (
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
                                ? trip.reservations.map((res, index) => <Reservation fetchTrips={fetchTrips} res={res} userId={trip.user_id} tripId={trip.trip_id} key={index} />)
                                : <p>This trip has no reservations</p>
                            }
                        </div>   
                    ))
                    : <p>{members[i]}: No trips planned</p>
            }</>);
        }
        return c;
    }

    return (
        <>
            <header class="text">
                {groupName}
                <button class="back-button" onClick={() => setCurrentPage(<Groups setCurrentPage={setCurrentPage}/>)}>
                    Back to Group
                </button>
                <br />
                <br />
            </header>
            {
                itineraries
                    ? viewAll(itineraries)
                    : <p>Loading...</p>
            }
        </>
    );
}
export default ViewMember;
