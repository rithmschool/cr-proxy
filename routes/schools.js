const express = require('express');
const router = new express.Router();
const School = require('../models/school');

/**
 * GET /schools
 * returns list of schools
 */
router.get('/', async function(req, res, next) {
  try {
    let schools = await School.getAll(req.query);
    return res.json({
      schools,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /schools/featured
 * return details about featured schools
 */
router.get('/featured', async function(req, res, next) {
  try {
    let featuredSchools = await School.getFeatured();
    return res.json({
      schools: featuredSchools,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /schools/:id
 * return details about one school
 */
router.get('/:id', async function(req, res, next) {
  try {
    let school = await School.get(req.params.id);

    return res.json({
      school,
    });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
