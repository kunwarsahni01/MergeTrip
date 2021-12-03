import flaskrApp from './AxiosSetup';
import { getDocs, collection, setDoc, getDoc, deleteDoc, doc, updateDoc, getFirestore, arrayUnion } from '@firebase/firestore';

const db = getFirestore();

// export const getTrips = (userId) => {
//   return flaskrApp.get('/trips/' + userId);
// };

export const getTrips = async (userId) => {
  const tripsCol = await getDocs(collection(db, 'trips', userId, 'trips'));
  const trips = tripsCol.docs.map(docRef => docRef.data());

  // console.log(trips);
  return trips;
};

export const createTrip = (userId, tripName, startDate, endDate) => {
  const tripId = userId + Date.now();
  return setDoc(doc(db, 'trips', userId, 'trips', tripId),
    {
      user_id: userId,
      trip_id: tripId,
      trip_name: tripName,
      start_date: startDate,
      end_date: endDate,
      reservations: []
    });
};

export const deleteTrip = (userId, tripId) => {
  return deleteDoc(doc(db, 'trips', userId, 'trips', tripId));
};

export const createReservation = (userId, tripId, newRes) => {
  const resId = tripId + Date.now();
  newRes.res_id = resId;
  return updateDoc(doc(db, 'trips', userId, 'trips', tripId), {
    reservations: arrayUnion(newRes)
  });
};

export const editReservation = async (userId, tripId, resId, newRes) => {
  newRes.res_id = resId;

  const currReservations = (await getDoc(doc(db, 'trips', userId, 'trips', tripId))).data().reservations;

  const newReservations = currReservations.map((res) => {
    if (res.res_id === newRes.res_id) return newRes;
    return res;
  });

  return updateDoc(doc(db, 'trips', userId, 'trips', tripId), {
    reservations: newReservations
  });
};

export const deleteReservation = async (userId, tripId, resId) => {
  const currReservations = (await getDoc(doc(db, 'trips', userId, 'trips', tripId))).data().reservations;

  console.log(currReservations);

  return updateDoc(doc(db, 'trips', userId, 'trips', tripId), {
    reservations: currReservations.filter(res => resId !== res.res_id)
  });
};

export const generateReservations = (userId, tripId) => {
  return flaskrApp.get('/gmails/' + userId + '/' + tripId);
};

// {
//   "res_type": self.type,
//   "res_org": self.organization,
//   "res_confirmation_num": self.confirmation_num,
//   "res_date": self.date,
//   "res_from_location": self.from_location,
//   "res_to_location": self.to_location
// }
