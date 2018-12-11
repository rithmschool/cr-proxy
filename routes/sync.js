const express = require('express');
const router = new express.Router();
const School = require('../models/school');
const Blog = require('../models/blog');
const secret = require('../secret');

/**
 * POST /sync
 * caches school and blog data to Redis
 */
router.post('/', async function(req, res, next) {
  try {
    if (req.body.secret !== secret) {
      return res.json({ message: 'Unauthorized' });
    }
    await School.syncToRedis();
    await Blog.syncToRedis();
    return res.json({ message: 'Success!' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
