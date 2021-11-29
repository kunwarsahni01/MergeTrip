import './ViewMember.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAuth } from "firebase/auth";
import withAuthHOC from './withAuthHOC';
import Groups from './Groups';
import { getTrips } from '../api/flaskr_api';

const ViewMember = ({inviteID, groupName}) => {
    const [trips, setTrips] = useState(false);

    const fetchTrips = async (userId) => {

        const res = await getTrips(userId);
        setTrips(res.data.trips);
    }

    useEffect(() => {
        const userId = auth.user.uid;
        //Check if {inviteID} user is in {groupName}
        const auth = getAuth();
        const db = getFirestore();

        const docref = doc(db, `groups/${groupName}/members`, inviteID);
        const docSnap = await getDoc(docref);
        if (docSnap.exists) {

        } else {
            alert("Did not input a group member, now displaying your itinerary");
            if (!trips) fetchTrips(userId);
        }
      }, []);

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