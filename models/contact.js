const axios = require('axios');
const { BASE_URL } = require('../config');

class Contact {
  static async postContact(bodyFormData) {
    //destructure the body data
    let {
      message,
      phone,
      campus_id,
      course_id,
      school_id,
      name,
      email,
      contact,
      contact_email
    } = bodyFormData;

    //contact post needs to be submitted in the below format
    let submitData = {
      contact_button_match: {
        message,
        phone,
        campus_id,
        course_id,
        school_id,
        name,
        email
      },
      school_contact_details: {
        contact,
        contact_email
      }
    };

    try {
      //post request
      let response = await axios({
        method: 'post',
        url: `${BASE_URL}/contact`,
        data: submitData,
        config: {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Contact;
