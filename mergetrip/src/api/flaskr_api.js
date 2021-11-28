import flaskrApp from './AxiosSetup';
import { setDoc, deleteDoc, doc, collection, getFirestore } from '@firebase/firestore';

const db = getFirestore();

export const getTrips = (userId) => {
  return flaskrApp.get('/trips/' + userId);
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

export const deleteTrip = async (userId, tripId) => {
  return await deleteDoc(doc(db, 'trips', userId, 'trips', tripId));
};

export const createReservation = (userId, tripId, resName, resLocation, resTime) => {
  return flaskrApp.post('/reservation/' + tripId + '/create', {
    data: {
      user_id: userId,
      res_name: resName,
      res_location: resLocation,
      res_time: resTime
    }
  });
};

export const generateReservations = (userId, tripId) => {
  return flaskrApp.get('/gmails/' + userId + '/' + tripId);
};
