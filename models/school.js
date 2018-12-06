const axios = require('axios');
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    "Content-Type": 'application/json'
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
    const response = await api.get('/schools');
    console.log(JSON.stringify(response));
    return response;
  }


}

module.exports = School;
