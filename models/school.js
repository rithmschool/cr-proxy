const axios = require('axios');
const { BASE_URL } = require('../config');
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
    description
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
    let response = await axios.get(`${BASE_URL}/schools`);
    let schoolsParsed = JSON.parse(response.data.schools);

    const updatedSchools = schoolsParsed.map(school => {
      let updatedSchool = { ...school };
      let cities = school.cities.map(city => {
        return city.name;
      });
      updatedSchool.cities = cities;

      // grab and attach logo url here
      if (school.rich_rich_files) {
        let uriParsed = JSON.parse(school.rich_rich_files.uri_cache);
        let logo_url = uriParsed.s100;
        updatedSchool.logo_url = logo_url;
        delete updatedSchool.rich_rich_files;
      }
      delete updatedSchool.logo_id;
      return updatedSchool;
    });

    return updatedSchools;
  }

  static async get(id) {
    let response = await axios.get(`${BASE_URL}/schools/${id}`);
    const {
      avg_review_rating,
      slug,
      name,
      email,
      website,
      about,
      review_count,
      banners,
      twitter,
      facebook,
      blog,
      github
    } = response.data.school;

    return {
      avg_review_rating,
      slug,
      id: response.data.school.id,
      name,
      email,
      website,
      about,
      review_count,
      banners,
      twitter,
      facebook,
      blog,
      github,
      logo_url: response.data.logo
    };
  }
}

module.exports = School;
