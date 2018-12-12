const { stripHTML } = require('../helpers/htmlParsers');
const CourseReportAPI = require('../helpers/CourseReportAPI');
const client = require('../server.js').client;
const Fuse = require('fuse.js');

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

  static async getAll({ page, search }) {
    if (!(await client.existsAsync('schools'))) {
      // get from store and return
      await School.syncToRedis();
    }
    console.log(page, search);
    const schools = JSON.parse(await client.getAsync('schools'));
    if (search === undefined) {
      return schools.slice(((page - 1) * 20), page * 20);
    }
    const options = {
      shouldSort: true,
      findAllMatches: true,
      threshold: 0.5,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 3,
      keys: [
        "name",
        "cities"
      ]
    };
    const fuse = new Fuse(schools, options);
    return fuse.search(search);
  }

  static async getFeatured() {
    if (!(await client.existsAsync('featured_schools'))) {
      // get from store and return
      await School.syncToRedis();
    }
    return JSON.parse(await client.getAsync('featured_schools'));
  }

  static async syncToRedis() {
    let schoolsData = await CourseReportAPI.getSchools();
    let schoolsParsed = JSON.parse(schoolsData.schools);
    let featuredSchoolsParsed = JSON.parse(schoolsData.featured_schools);
    let schools = School._cleanData(schoolsParsed);
    let featuredSchools = School._cleanData(featuredSchoolsParsed);

    // store schools and featured schools to redis
    let schoolJSON = JSON.stringify(schools);
    await client.setAsync('schools', JSON.stringify(schools));
    await client.setAsync('featured_schools', JSON.stringify(featuredSchools));
  }

  static _cleanData(schoolsParsed) {
    const updatedSchools = schoolsParsed.map(school => {
      let updatedSchool = { ...school };
      let cities = school.cities.map(city => {
        return { name: city.name, lat: city.latitude, long: city.longitude };
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
    let schoolData = await CourseReportAPI.getSchool(id);
    const {
      avg_review_rating,
      slug,
      name,
      email,
      website,
      about,
      meta_description,
      review_count,
      banners,
      twitter,
      facebook,
      blog,
      github
    } = schoolData.school;

    // parse about and replace here
    let aboutText = stripHTML(about);

    const school = {
      id: schoolData.school.id,
      avg_review_rating,
      slug,
      name,
      email,
      website,
      about: aboutText,
      meta_description,
      review_count,
      banners,
      twitter,
      facebook,
      blog,
      github
    };

    let campuses = JSON.parse(schoolData.campuses);

    campuses = campuses.reduce((acc, campus) => {
      return {
        ...acc,
        [campus.id]: {
          id: campus.id,
          name: campus.mailing_city,
          courses: campus.courses.map(course => {
            return {
              id: course.id,
              name: course.name
            };
          })
        }
      };
    }, {});

    const reviews = schoolData.reviews.map(review => {
      return {
        id: review.id,
        body: stripHTML(review.body),
        reviewer_name: review.reviewer_name,
        overall_experience_rating: review.overall_experience_rating,
        course_curriculum_rating: review.course_curriculum_rating,
        course_instructors_rating: review.course_instructors_rating,
        school_job_assistance_rating: review.school_job_assistance_rating,
        created_at: review.created_at
      };
    });

    school.logo = schoolData.logo;
    school.campuses = campuses;
    school.reviews = reviews;
    if (schoolData.contact) {
      school.contact = {
        name: schoolData.contact.name,
        email: schoolData.contact.email
      };
    }

    return school;
  }
}

module.exports = School;
