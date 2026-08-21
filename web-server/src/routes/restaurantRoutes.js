
/*
 * restaurantRoutes.js - Express router for restaurant and product endpoints
 */

const express = require('express');
const restaurantRole = require('../middleware/roleMiddleware');
const { getAllRestaurants, createRestaurant, getRestaurantById,
updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController');
const productController = require('../controllers/productController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// 404 on a malformed id
router.param('id', (req, res, next, val) => {
    if (!mongoose.isValidObjectId(val)) return res.status(404).json({ error: "Restaurant not found" });
    next();
});
router.param('pId', (req, res, next, val) => {
    if (!mongoose.isValidObjectId(val)) return res.status(404).json({ error: "Product not found" });
    next();
});



router.get('/', getAllRestaurants);
router.post('/', authMiddleware, restaurantRole, createRestaurant);
router.get('/:id', getRestaurantById);
router.patch('/:id', authMiddleware, restaurantRole, updateRestaurant);
router.delete('/:id', authMiddleware, restaurantRole, deleteRestaurant);
router.get('/:id/products', productController.getProductsByRestaurant);
router.post('/:id/products', authMiddleware, restaurantRole, productController.createProduct);
router.get('/:id/products/:pId', authMiddleware, productController.getProductById);
router.patch('/:id/products/:pId', authMiddleware, restaurantRole, productController.updateProduct);
router.delete('/:id/products/:pId', authMiddleware, restaurantRole, productController.deleteProduct);

module.exports = router;
