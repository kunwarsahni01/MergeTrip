import React, { useState } from 'react';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { deleteReservation } from '../api/flaskr_api';

const Reservation = ({ res, userId, tripId, fetchTrips }) => {
  const [showOptions, setShowOptions] = useState(false);
  return (

    <div className='Trip-reservation'>
      {/* <p>{res.res_type}</p>
      <p>{res.res_name}</p>
      <p>{res.res_checkin}</p>
      <p>{res.res_checkout}</p>
      <p>{res.res_address}</p>
      <p>{res.res_confirmation_num}</p>
      <p>{res.res_org}</p> */}
      {Object.keys(res).map((resKey, index) => {
        return <p key={index}>{resKey}: {res[resKey]}</p>;
      })}
      <BsFillCaretDownFill onClick={() => { setShowOptions(prevShowState => !prevShowState); }} />
      {showOptions
        ? (
          <>
            <button className='Reservation-button'>Edit reservation</button>
            <button
              className='Reservation-button' onClick={async () => {
                await deleteReservation(userId, tripId, res.res_id);
                fetchTrips(userId);
              }}
            >Delete reservation
            </button>
          </>
          )
        : null}
    </div>
  );
};

export default Reservation;
