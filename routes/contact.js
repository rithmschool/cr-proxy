const express = require('express');
const router = new express.Router();
const Contact = require('../models/contact');

//Post a contact
router.post('/', async function(req, res, next) {
  try {
    const contactForm = await Contact.postContact(req.body);
    return res.json({ contactForm });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
