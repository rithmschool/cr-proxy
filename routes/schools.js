const express = require('express');
const router = new express.Router();
const School = require('../models/school');

/**
 * GET /schools 
 * returns list of schools
 */
router.get('/', async function(req, res, next) {
  try {
    let schools = await School.getAll(req.query.page);
    return res.json({
      schools
    })
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /school/:id
 * return details about one school
 */
router.get('/:id', async function(req, res, next) {
  try {
    let school = await School.get(req.params.id);
    return res.json({
      school
    })
  } catch (err) {
    return next(err);
  }
})

module.exports = router;
