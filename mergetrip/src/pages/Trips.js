import React, { useEffect, useState } from 'react';
import { getAuth } from '@firebase/auth';
import { createReservation, deleteTrip, getTrips } from '../api/flaskr_api';
import CreateTrip from './CreateTrip';
import CreateReservation from './CreateReservations';
import './Trip.css';
import { useAuthState } from '../firebase';
import Reservation from './Reservation';

const Trips = (props) => {
  const auth = useAuthState();

  const [trips, setTrips] = useState(false);
  const [showTrips, setShowTrips] = useState(false);

  const addNewTrip = (newTrip) => {
    setTrips(prevTrips => [...prevTrips, newTrip]);
  };

  const handleDeleteTrip = async (trip) => {
    const res = await deleteTrip(auth.user.uid, trip.trip_id);

    setTrips((prevTrips) => {
      const newTrips = prevTrips.filter(prevTrip => prevTrip.trip_id !== trip.trip_id);
      return newTrips;
    });
  };

  const addNewReservation = async (tripId, res) => {
    setTrips((prevTrips) => {
      const newTrips = [...prevTrips];

      newTrips.forEach((trip) => {
        if (trip.trip_id === tripId) trip.reservations = [...trip.reservations, res];
      });

      return newTrips;
    });
  };

  useEffect(() => {
    const userId = auth.user.uid;
    if (!trips) fetchTrips(userId);
  }, []);

  const fetchTrips = async (userId) => {
    console.log('Fetching trips:\n');

    const res = await getTrips(userId);
    setTrips(res.data.trips);
  };

  return (
    <div>
      <style>
        @import url("https://use.typekit.net/osw3soi.css");
      </style>
      <hr style={{ marginBottom: '20px', marginTop: '20px' }} />
      <CreateTrip updateTrips={addNewTrip} />
      {
        trips
          ? trips.map((trip, index) => (
            <div key={index} className='Trip-container'>
              <div className='Trip-header'>
                <p>{trip.trip_name}</p>
              </div>

              <CreateReservation tripId={trip.trip_id} updateReservations={addNewReservation} />

              <div className='Trip-body'>
                <p>Start: {trip.start_date}</p>
                <p>End: {trip.end_date}</p>
              </div>
              <button className='Trip-button' onClick={() => { handleDeleteTrip(trip); }}>Delete trip</button>
              <p>Reservations:</p>
              <button className='Trip-button' type='button' onClick={() => { setShowTrips(prevShow => !prevShow); }}>Toggle Reservations</button>
              {
                showTrips && trip.reservations.length !== 0
                  ? trip.reservations.map((res, index) => <Reservation res={res} key={index} />)
                  : null
              }
            </div>
            ))
          : <p>Loading Trips...</p>
      }
    </div>

  );
};

export default Trips;
