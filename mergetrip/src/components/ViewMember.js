import './ViewMember.css';
import React, { useEffect, useState } from 'react';
import Groups from './Groups';
import { getTrips } from '../api/flaskr_api';
import {doc, getDoc, getFirestore } from 'firebase/firestore';
import Reservation from '../pages/Reservation';
import { useAuthState } from '../firebase';


const ViewMember = ({viewId, groupName, setCurrentPage}) => {
    const auth = useAuthState();
    const [trips, setTrips] = useState(false);

    const fetchTrips = async (userId) => {

        const res = await getTrips(userId);
        setTrips(res.data.trips);
    }

    useEffect(() => {
        const userId = auth.user.uid;
        //Check if {inviteID} user is in {groupName}
        checkMember(userId);
    }, []);

    const checkMember = async (userId) => {
        if (viewId == null) {
            if (!trips) fetchTrips(userId);
        } else {
        const db = getFirestore();
        const docref = await doc(db, `groups/${groupName}/members`, viewId);
        const docSnap = await getDoc(docref);
        if (docSnap.exists) {
            if (!trips) fetchTrips(viewId);
        } else {
            if (!trips) fetchTrips(userId);
        }
        }
    }

    return (
        <>
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
                        {/*
                        <button className='Trip-button' type='button' onClick={() => { setShowTrips(prevShow => !prevShow); }}>Toggle Reservations</button>
                        */}
                        {
                            trip.reservations.length !== 0
                                ? trip.reservations.map((res, index) => <Reservation fetchTrips={fetchTrips} res={res} userId={trip.user_id} tripId={trip.trip_id} key={index} />)
                                : <p>Click the button to hide/show your reservations</p>
                        }
                    </div>
                ))
                : <p>No Trips planned</p>
            }
        </>
    );
};
export default ViewMember;

/*
class ViewMember extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            profileURL: "",
            groupName: "",
            trips: false
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.clickMenu = this.clickMenu.bind(this);
        this.onGroup = this.onGroup.bind(this);
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

    fetchTrips = async (userId) => {
        const res = await getTrips(userId);
        setTrips(res.data.trips);
    }


    clickMenu() {
        let sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("open");
    }

    onGroup() {
        this.props.setCurrentPage(<Groups />);
    }

    render() {
        return (
            <>
            <header>
                Displaying Itinerary
            </header>
            <div>
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
    }
}
export default withRouter(withAuthHOC(ViewMember));
*/