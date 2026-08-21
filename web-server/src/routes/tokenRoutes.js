/*
 * tokenRoutes.js - Express router for authentication (login) endpoint
 */

const express = require('express');
const tokenController = require('../controllers/tokenController');

const router = express.Router();//create the router to hold the routes

router.post('/', tokenController.login); //set the post route

module.exports = router;