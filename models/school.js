const axios = require('axios');
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

class School {
  constructor({
    name,
    id,
    location,
    logo_url,
    rating,
    reviewCount,
    description,
  }) {
    this.name = name;
    this.id = id;
    this.location = location;
    this.logo_url = logo_url;
    this.rating = rating;
    this.reviewCount = reviewCount;
    this.description = description;
  }

  static async getAll() {
    let response = await axios.get('http://localhost:3000/schools');
    let schoolsParsed = JSON.parse(response.data.schools);
    return schoolsParsed;
  }
}

module.exports = School;
