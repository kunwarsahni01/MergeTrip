import React, { useEffect, useState } from 'react';
import { getAuth } from '@firebase/auth';
import { createReservation, deleteTrip, generateReservations, getTrips } from '../api/flaskr_api';
import CreateTrip from './CreateTrip';
import CreateReservation from './CreateReservations';
import './Trip.css';
import { useAuthState } from '../firebase';
import Reservation from './Reservation';
import ReactLoading from 'react-loading';

const Trips = (props) => {
  const auth = useAuthState();

  const [trips, setTrips] = useState(false);
  const [showTrips, setShowTrips] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteTrip = async (tripId) => {
    const userId = auth.user.uid;
    await deleteTrip(userId, tripId);
    fetchTrips(userId);
  };

  const generateRes = async (userId, tripId) => {
    setLoading(true);
    await generateReservations(userId, tripId);
    fetchTrips(userId);
  };

  useEffect(() => {
    const userId = auth.user.uid;
    if (!trips) fetchTrips(userId);
  }, []);

  const fetchTrips = async (userId) => {
    console.log('Fetching trips:\n');

    const res = await getTrips(userId);
    setTrips(res);
    setLoading(false);
  };

  return (
    <div className='Trips'>
      {loading
        ? <div className='loading-container'>
          <ReactLoading className='loading' type='spin' height={70} width={70} />
        </div>
        : null}
      <style>
        @import url("https://use.typekit.net/osw3soi.css");
      </style>
      <CreateTrip fetchTrips={fetchTrips} />
      {
        trips
          ? trips.map((trip, index) => (
            <div key={index} className='Trip-container'>
              <div className='Trip-header'>
                <p>{trip.trip_name}</p>
              </div>

              <CreateReservation tripId={trip.trip_id} fetchTrips={fetchTrips} />

              <div className='Trip-body'>
                <p>Start: {trip.start_date}</p>
                <p>End: {trip.end_date}</p>
              </div>
              <button
                className='Trip-button' onClick={() => { handleDeleteTrip(trip.trip_id); }}
              >Delete trip
              </button>
              <p>Reservations:</p>
              {
                trip.reservations.length !== 0
                  ? <button className='Trip-button' type='button' onClick={() => { setShowTrips(prevShow => !prevShow); }}>Toggle Reservations</button>
                  : <p>No Reservations</p>
              }

              {
                showTrips && trip.reservations.length !== 0
                  ? trip.reservations.map((res, index) => <Reservation fetchTrips={fetchTrips} res={res} userId={trip.user_id} tripId={trip.trip_id} key={index} />)
                  : null
              }

              <button className='Trip-button' type='button' onClick={() => {
                generateRes(auth.user.uid, trip.trip_id);
              }}>Auto Populate Reservations</button>
            </div>
          ))
          : <div className='loading-container'>
            <ReactLoading className='loading' type='spin' height={70} width={70} />
          </div>
      }
    </div>

  );
};

export default Trips;
