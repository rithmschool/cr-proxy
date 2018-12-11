const CourseReportAPI = require('../helpers/CourseReportAPI');
const { getHeaderImg, stripHTML } = require('../helpers/htmlParsers');
const client = require('../server.js').client;

class Blog {
  constructor(posts) {
    this.posts = posts || [];
  }

  static async getAll() {
    if (!(await client.existsAsync('posts'))) {
      await Blog.syncToRedis();
    }

    return JSON.parse(await client.getAsync('posts'));
  }

  static async syncToRedis() {
    let postsAccumulate = [];
    let postsRailsResponse;
    let pageNum = 1;
    while (postsRailsResponse !== '[]') {
      postsRailsResponse = await CourseReportAPI.getPosts(pageNum);
      postsAccumulate = [...postsAccumulate, ...JSON.parse(postsRailsResponse)];
      pageNum++;
    }

    // get all images out
    let updatedPosts = postsAccumulate.map(post => {
      //pull out header image from about
      let header_url = getHeaderImg(post.body);

      const { id, title, post_author, created_at } = post;
      const updatedPost = {};
      updatedPost.id = id;
      updatedPost.title = title;
      updatedPost.created_at = created_at;
      updatedPost.header_url = header_url;
      updatedPost.author = `${post_author.first_name} ${post_author.last_name}`;
      return updatedPost;
    });

    // store updatedPosts to redis
    await client.setAsync('posts', JSON.stringify(updatedPosts));
  }

  static async get(post_id) {
    let postData = await CourseReportAPI.getPost(post_id);

    // get image out and strip html from body
    let post = JSON.parse(postData.post);
    let header_url = getHeaderImg(post.body);
    let body = stripHTML(post.body);
    post.body = body;
    post.header_url = header_url;
    post.author = `${post.post_author.first_name} ${
      post.post_author.last_name
    }`;
    delete post.post_author;

    return new Post(post);
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
    author,
    header_url
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
    this.author = author;
    this.header_url = header_url;
  }
}

module.exports = Blog;
