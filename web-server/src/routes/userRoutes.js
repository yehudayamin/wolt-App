
/*
 * userRoutes.js - Express router for user-related endpoints
*/

const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();//create the router to hold the routes
const mongoose = require('mongoose');

// 404 on a malformed id
router.param('id', (req, res, next, val) => {
    if (!mongoose.isValidObjectId(val)) return res.status(404).json({ error: "Not found" });
    next();
});

router.get('/:id', authMiddleware, userController.getUserById); //set the get route
router.post('/', userController.createUser); //set the post route
router.patch('/:id', authMiddleware, userController.updateUser); //update user
module.exports = router;