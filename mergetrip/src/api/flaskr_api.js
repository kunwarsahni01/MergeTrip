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

export const createReservation = (userId, tripId, resName, resLocation, resTime) => {
  const resId = tripId + Date.now();
  return updateDoc(doc(db, 'trips', userId, 'trips', tripId), {
    reservations: arrayUnion({
      user_id: userId,
      res_id: resId,
      res_name: resName,
      res_location: resLocation,
      res_time: resTime
    })
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
