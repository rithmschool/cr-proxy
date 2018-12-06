const CourseReportAPI = require('../helpers/CourseReportAPI');

class Blog {
  constructor(posts) {
    this.posts = posts || [];
  }

  static async getPosts(pageNum = 1) {
    let blogs = await CourseReportAPI.getPosts();
    return new Blog(blogs.map(post => new Post(post)));
  }
}

class Post {
  constructor({
    id,
    title,
    body,
    created_at,
    updated_at,
    published,
    slug,
    meta_description,
    sponsored,
    sponsorship_begin,
    sponsorship_expire,
    image_id,
    card_info_id,
    post_author
  }) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.published = published;
    this.slug = slug;
    this.meta_description = meta_description;
    this.sponsored = sponsored;
    this.sponsorship_begin = sponsorship_begin;
    this.sponsorship_expire = sponsorship_expire;
    this.image_id = image_id;
    this.card_info_id = card_info_id;
    this.post_author = post_author;
  }
}

module.exports = Blog;
