import React from 'react';
import { FaPlane, FaPlaneArrival, FaPlaneDeparture } from 'react-icons/fa';

// {
//   "res_type": self.type,
//   "res_org": self.organization,
//   "res_confirmation_num": self.confirmation_num,
//   "res_date": self.date,
//   "res_from_location": self.from_location,
//   "res_to_location": self.to_location,
//   "res_notes": self.notes
// }
const FlightReservation = (props) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <FaPlane style={{ margin: 'auto' }} size={50} />
      </div>
      <div style={{ flex: 7, fontSize: '20px', borderLeft: 'solid 2px white', paddingLeft: '10px' }}>
        <p>Airlines: {props.res_org}</p>
        <p>Confirmation Number: {props.res_confirmation_num}</p>
        <p>Time: {props.res_date}</p>

        <div style={{ margin: '15px', display: 'flex' }}>
          <div style={{ flex: 1 }}><FaPlaneDeparture /> Departure:
            <p style={{ fontSize: '35px' }}>{props.res_from_location}</p>
          </div>
          <div style={{ flex: 1 }}><FaPlaneArrival /> Arrival:
            <p style={{ fontSize: '35px' }}>{props.res_to_location}</p>
          </div>
        </div>

        <div style={{ marginTop: '20px', fontSize: '10px', wordBreak: 'break-word' }}>Additional Notes:
          <p>{props.res_notes}</p>
        </div>
      </div>
    </div>

  );
};

export default FlightReservation;
