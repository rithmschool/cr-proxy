const CourseReportAPI = require('../helpers/CourseReportAPI');
const {getHeaderImg, stripHTML} = require('../helpers/htmlParsers');
const client = require('../server.js').client;
const Fuse = require('fuse.js');

class Blog {
  constructor(posts) {
    this.posts = posts || [];
  }

  static async getAll({page, search}) {
    if (!(await client.existsAsync('posts'))) {
      await Blog.syncToRedis();
    }
    const posts = JSON.parse(await client.getAsync(`posts`));
    if (search === undefined) {
      return posts.slice((page - 1) * 20, page * 20);
    }
    // search exists so lets return search results
    const options = {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 4,
      keys: [
          "title"
      ]
    };
    const fuse = new Fuse(posts, options);
    return fuse.search(search)
  }

  static async syncToRedis() {
    let postsRailsResponse;
    let postsAccumulate = [];
    let pageNum = 1;
    while (postsRailsResponse !== '[]') {
      postsRailsResponse = await CourseReportAPI.getPosts(pageNum);
      const posts = JSON.parse(postsRailsResponse);
      // get all images out
      let updatedPosts = posts.map(post => {
        //pull out header image from about
        let header_url = getHeaderImg(post.body);

        const {id, title, post_author, created_at} = post;
        const updatedPost = {};
        updatedPost.id = id;
        updatedPost.title = title;
        updatedPost.created_at = created_at;
        updatedPost.header_url = header_url;
        updatedPost.author = `${post_author.first_name} ${
          post_author.last_name
        }`;
        return updatedPost;
      });
      postsAccumulate.push(updatedPosts);
      pageNum++;
    }
    await client.setAsync(`posts`, JSON.stringify(postsAccumulate));
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
    this.author = author;
    this.header_url = header_url;
  }
}

module.exports = Blog;
