const axios = require('axios');
const {parse, stringify} = require('flatted');
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    "Content-Type": 'application/json',
    "Accept": 'application/json'
  }
});

class School {
  constructor({ name, id, location, logo_url, rating, reviewCount, description }) {
    this.name = name;
    this.id = id;
    this.location = location;
    this.logo_url = logo_url;
    this.rating = rating;
    this.reviewCount = reviewCount;
    this.description = description;
  }

  static async getAll() {
    let response;
    api.get('/schools').then((resp) => {
      console.log('raw response', resp)
      let parsed = parse(resp);
      console.log('flatted parsed:', parsed)
      response = parsed;
    }).catch((err) => {
      console.log(err);
    });
    console.log(response);
    return response;
  }


}

module.exports = School;
