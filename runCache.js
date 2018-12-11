const axios = require('axios');
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const secret = require('./secret');

axios
  .post(`http://localhost:3001/sync`, { secret })
  .then(resp => console.log('resp is', resp.data))
  .catch(err => console.log('err is', err));
