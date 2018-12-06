const axios = require('axios');

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

  static async get(id) {
    const result = await axios.get('', {id})
  }


}