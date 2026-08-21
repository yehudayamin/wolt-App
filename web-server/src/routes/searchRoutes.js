/*
 * searchRoutes.js - Express router for the search endpoint
 *
 */

const express = require('express');
const {search} = require('../controllers/searchController');
const router = express.Router();


router.get('/:query', search);

module.exports = router;