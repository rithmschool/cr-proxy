const express = require('express');
const router = new express.Router();
const Blog = require('../models/blog');

//Get a blog list
router.get('/', async function(req, res, next) {
  try {
    const blogList = await Blog.getPosts();
    return res.json({ blogList });
  } catch (error) {
    return next(error);
  }
});

//Create a new company
// router.post(
//   '/',
//   ensureAdminUser,
//   validateInput(newCompanySchema),
//   async function(req, res, next) {
//     try {
//       const company = await Company.createCompany(req.body);
//       return res.json({ company });
//     } catch (error) {
//       return next(error);
//     }
//   }
// );

module.exports = router;
