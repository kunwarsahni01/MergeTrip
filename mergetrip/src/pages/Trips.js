import React, { useEffect, useState } from 'react';
import { getAuth } from '@firebase/auth';
import { createReservation, deleteTrip, getTrips } from '../api/flaskr_api';
import CreateTrip from './CreateTrip';
import CreateReservation from './CreateReservations';
import './Trip.css'

const Trips = (props) => {
  const auth = getAuth();

  const [trips, setTrips] = useState(false);

  const addNewTrip = (newTrip) => {
    setTrips(prevTrips => [...prevTrips, newTrip]);
  };

  const handleDeleteTrip = async (trip) => {
    const res = await deleteTrip(auth.currentUser.uid, trip.trip_id);

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
    const userId = auth.currentUser.uid;
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
              <button className='Trip-button' onClick={() => { handleDeleteTrip(trip); }}>Delete trip</button>
              <p>Reservations:</p>
              {
                trip.reservations.length != 0
                  ? (trip.reservations.map((res, index) => (
                    <div className='Trip-reservation' key={index}>
                      <h1>{res.res_name}</h1>
                      <p>{res.res_location}</p>
                      <p>{res.res_time}</p>
                      <button className='Reservation-button' >Delete reservation</button>
                    </div>
                  ))
                  )
                  : null
              }
              < CreateReservation tripId={trip.trip_id} updateReservations={addNewReservation} />
            </div>
          ))
          : <p>Loading Trips...</p>
      }
      <hr style={{ marginBottom: '20px', marginTop: '20px'}} />
      <CreateTrip updateTrips={addNewTrip} />
    </div >

  );
};

export default Trips;
