const express = require('express');
const router = new express.Router();
const Blog = require('../models/blog');

//Get a blog list
router.get('/', async function(req, res, next) {
  try {
    const posts = await Blog.getAll(req.query);
    return res.json({ 
      posts 
    });
  } catch (e) {
    return next(e);
  }
});

// Get a single blog details
router.get('/:post_id', async function(req, res, next) {
  try {
    const post = await Blog.get(req.params.post_id);
    return res.json({
      post
    })
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
