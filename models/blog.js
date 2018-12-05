const axios = require('axios');
const BASE_URL = require('../config');

class Blog {
  constructor(posts) {
    this.posts = posts;
  }

  static async getPosts(pageNum = 1) {
    let posts = await axios.get(`${BASE_URL}/posts/index`, {
      page: pageNum
    });
    let newPosts = [...this.posts, ...posts.data];
    return new Blog(newPosts.map(post => new Post(post)));
  }
}

class Post {
  // constructor({id, title, body, updated_at, )
}

module.exports = Blog;
