import flaskrApp from './AxiosSetup';

export const getTrips = (userId) => {
  return flaskrApp.get('/trips/' + userId);
};

export const createTrip = (userId, tripName, startDate, endDate) => {
  return flaskrApp.post('/trips/create', {
    data: {
      user_id: userId,
      trip_name: tripName,
      start_date: startDate,
      end_date: endDate
    }
  });
};

export const deleteTrip = (userId, tripId) => {
  console.log(userId, tripId);
  return flaskrApp.post('/trip/' + tripId + '/delete', {
    data: {
      user_id: userId
    }
  });
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
