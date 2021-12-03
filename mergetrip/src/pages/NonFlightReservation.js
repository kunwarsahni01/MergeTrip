import React from 'react';
import { FaBed } from 'react-icons/fa';

// return {
//   "res_type": self.type,
//   "res_org": self.organization,
//   "res_confirmation_num": self.confirmation_num,
//   "res_address": self.address,
//   "res_checkin": self.checkin,
//   "res_checkout": self.checkout,
//   "res_notes": self.notes
// }

const NonFlightReservations = (props) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <FaBed style={{ margin: 'auto' }} size={50} />
      </div>
      <div style={{ flex: 7, fontSize: '20px', borderLeft: 'solid 2px white', paddingLeft: '10px' }}>
        <p>Provider: {props.res_org}</p>
        <p>Confirmation Number: {props.res_confirmation_num}</p>
        <p>Address: {props.res_address}</p>

        <div style={{ margin: '15px', display: 'flex' }}>
          <div style={{ flex: 1 }}>Checkin:
            <p style={{ fontSize: '25px' }}>{props.res_checkin}</p>
          </div>
          <div style={{ flex: 1 }}>Arrival:
            <p style={{ fontSize: '25px' }}>{props.res_checkout}</p>
          </div>
        </div>

        <div style={{ marginTop: '20px', fontSize: '10px', wordBreak: 'break-word' }}>Additional Notes:
          <p>{props.res_notes}</p>
        </div>
      </div>
    </div>
  );
};

export default NonFlightReservations;
