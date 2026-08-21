
/*
 * orderRoutes.js - Express router for order-related endpoints
*/

const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();//create the router to hold the routes
const mongoose = require('mongoose');

// 404 on a malformed id
router.param('id', (req, res, next, val) => {
    if (!mongoose.isValidObjectId(val)) return res.status(404).json({ error: "Not found" });
    next();
});

router.get('/', authMiddleware, orderController.getOrdersByUser); //set get route
router.get('/:id', authMiddleware, orderController.getOrderById); //set get route
router.post('/', authMiddleware, orderController.createOrder); //set the post route
router.patch('/:id', authMiddleware, orderController.updateOrder); //set patch route
router.delete('/:id', authMiddleware, orderController.deleteOrder); //set delete route

module.exports = router;