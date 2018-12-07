const CourseReportAPI = require('../helpers/CourseReportAPI');
const { getHeaderImg, stripHTML } = require('../helpers/htmlParsers');

class Blog {
  constructor(posts) {
    this.posts = posts || [];
  }

  static async getPosts(pageNum = 1) {
    let posts = await CourseReportAPI.getPosts();
    let postsParsed = JSON.parse(posts);
    // get all images out
    let updatedPosts = postsParsed.map(post => {
      //pull out header image from about
      let header_url = getHeaderImg(post.body);
      let body = stripHTML(post.body);

      let updatedPost = { ...post };
      updatedPost.body = body;
      updatedPost.header_url = header_url;
      return updatedPost;
    })
    return new Blog(updatedPosts.map(post => new Post(post)));
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
    post_author,
    header_url,
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
    this.header_url = header_url;
  }
}

module.exports = Blog;
