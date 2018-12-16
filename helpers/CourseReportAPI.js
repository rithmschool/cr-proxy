const axios = require('axios');
const { BASE_URL } = require('../config');
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

class CourseReportAPI {
  static async request(endpoint, params = {}, verb = 'get') {
    let q;
    if (verb === 'get') {
      q = axios.get(`${BASE_URL}${endpoint}`, { params: { ...params } });
    } else if (verb === 'post') {
      q = axios.post(`${BASE_URL}${endpoint}`, { ...params });
    } else if (verb === 'patch') {
      q = axios.patch(`${BASE_URL}${endpoint}`, { ...params });
    } else if (verb === 'delete') {
      q = axios.delete(`${BASE_URL}${endpoint}`, { params: { ...params } });
    }

    try {
      let data = (await q).data;
      return data;
    } catch (err) {
      console.error('API Error:', err.response);
      let message = err.response.data.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** get a list of schools */
  static async getSchools() {
    const res = await this.request(`/schools`);
    return res;
  }

  /** get a details for a single school */
  static async getSchool(id) {
    const res = await this.request(`/schools/${id}`);
    return res;
  }

  /** get a list of schools */
  static async getPosts(pageNum) {
    const res = await this.request(`/blog`, { page: pageNum });
    return res.posts;
  }

  /** get a details for a single post */
  static async getPost(post_id) {
    const res = await this.request(`/blog/${post_id}`);
    return res;
  }
}

module.exports = CourseReportAPI;
