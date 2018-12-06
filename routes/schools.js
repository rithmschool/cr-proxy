const express = require('express');
const router = new express.Router();
const School = require('../models/school');

/**
 * GET / Blogs 
 * returns list of blogs
 * (consider pagination)
 */
router.get('/', async function(req, res, next) {
  try {
    let schools = await School.getAll();
    console.log(schools);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
