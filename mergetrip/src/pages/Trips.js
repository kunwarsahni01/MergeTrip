import React, { useEffect, useState } from 'react';
import { getAuth } from '@firebase/auth';
import { createReservation, deleteTrip, getTrips } from '../api/flaskr_api';
import CreateTrip from './CreateTrip';
import CreateReservation from './CreateReservations';

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
      {
        trips
          ? trips.map((trip, index) => (
            <div key={index} style={{ marginTop: '50px', marginBottom: '50px' }}>

              <button onClick={() => { handleDeleteTrip(trip); }}>Delete trip</button>

              <CreateReservation tripId={trip.trip_id} updateReservations={addNewReservation} />

              <p>trip name: {trip.trip_name}</p>
              <p>start date: {trip.start_date}</p>
              <p>end date: {trip.end_date}</p>
              <hr />
              <p>reservations:</p>
              {trip.reservations.length != 0
                ? (trip.reservations.map((res, index) => (
                  <div key={index}>
                    <hr />
                    <p>reservation name: {res.res_name}</p>
                    <p>reservation location: {res.res_location}</p>
                    <p>reservation time: {res.res_time}</p>
                    <hr />
                  </div>
                  ))
                  )
                : <p>No reservations ;-;</p>}

            </div>
            ))
          : <p>Loading Trips...</p>
      }
      <hr style={{ marginBottom: '50px' }} />
      <CreateTrip updateTrips={addNewTrip} />
    </div>

  );
};

export default Trips;
