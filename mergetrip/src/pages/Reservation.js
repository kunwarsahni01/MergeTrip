import React, { useState } from 'react';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { getAuth } from '@firebase/auth';
import { deleteReservation } from '../api/flaskr_api';
import EditReservations from './EditReservations';

const Reservation = ({ res, userId, tripId, fetchTrips }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className='Trip-reservation'>
      {Object.keys(res).map((resKey, index) => {
        return <p key={index}>{resKey}: {res[resKey]}</p>;
      })}
      <BsFillCaretDownFill onClick={() => { setShowOptions(prevShowState => !prevShowState); }} />
      {showOptions
        ? (
          <>
            <EditReservations res={res} userId={userId} tripId={tripId} fetchTrips={fetchTrips} setShowOptions={setShowOptions} />
            <div>
              <button
                className='Reservation-button' onClick={async () => {
                  await deleteReservation(userId, tripId, res.res_id);
                  fetchTrips(userId);
                }}
              >Delete reservation
              </button>
            </div>
          </>
          )
        : null}
    </div>
  );
};

export default Reservation;
