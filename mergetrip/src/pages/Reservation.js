import React, { useState } from 'react';
import { BsFillCaretDownFill } from 'react-icons/bs';

const Reservation = ({ res }) => {
  const [showOptions, setShowOptions] = useState(false);
  return (

    <div className='Trip-reservation'>
      <p>{res.res_name}</p>
      <p>{res.res_location}</p>
      <p>{res.res_time}</p>
      <BsFillCaretDownFill onClick={() => { setShowOptions(prevShowState => !prevShowState); }} />
      {showOptions
        ? (
          <>
            <button className='Reservation-button'>Edit reservation</button>
            <button className='Reservation-button'>Delete reservation</button>
          </>
          )
        : null}
    </div>
  );
};

export default Reservation;
