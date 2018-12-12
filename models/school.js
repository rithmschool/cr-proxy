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

  static async getAll({pageNum, search}) {
    if (!(await client.existsAsync('schools'))) {
      // get from store and return
      await School.syncToRedis();
    }
    console.log(pageNum, search);
    const schools = JSON.parse(await client.getAsync('schools'));
    if(search === undefined) {
      return schools.slice(((pageNum-1)*20), pageNum*20);
    } 
    const options = {
      shouldSort: true,
      findAllMatches: true,
      includeScore: true,
      includeMatches: true,
      threshold: 0.,
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

  static async syncToRedis() {
    let schools = await CourseReportAPI.getSchools();
    let schoolsParsed = JSON.parse(schools);

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

    // store updatedSchools to redis
    await client.setAsync('schools', JSON.stringify(updatedSchools));
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
