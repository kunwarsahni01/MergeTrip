import axios from 'axios';

const flaskrApp = axios.create({
  // will update once deployed
  baseURL: 'https://api.mergetrip.io/'
});

export default flaskrApp;
