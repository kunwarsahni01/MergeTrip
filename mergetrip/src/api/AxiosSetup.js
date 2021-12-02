import axios from 'axios';

const flaskrApp = axios.create({
  // will update once deployed
  // baseURL: 'https://api.mergetrip.io/'
  baseURL: 'http://localhost:5000/'
});

export default flaskrApp;
