import React, { useState } from 'react';
import { BsFillCaretDownFill } from 'react-icons/bs';

const Reservation = ({ res }) => {
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
      <BsFillCaretDownFill style={{ transform: `rotate(${90})` }} onClick={() => { setShowOptions(prevShowState => !prevShowState); }} />
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
