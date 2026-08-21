
/*
 * orderController.js - Handles HTTP requests for Order operations
*/

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

async function createOrder(req, res){
    const userId = req.user.userId; //get the user id from req.user, after token validation
    const restaurantId = req.body.restaurantId; //get restuarant id from the body
    const items = req.body.items; //get items from the body

    if (!userId || !restaurantId || !items){//check everything is present
        return res.status(400).json({ error: "Missing required fields or user-id header"})
    }
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "items must be a non-empty array" });
    }
    const existingRestaurant = await Restaurant.findById(restaurantId).populate('products');
    if (!existingRestaurant) { //if restuarant doesn't exists
        return res.status(404).json({ error: "Restaurant not found"})
    }
    
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    for (const itemName of items) {
        const exists = existingRestaurant.products.some(p => p.name.toLowerCase() === itemName.toLowerCase());
        if (!exists) {
            return res.status(404).json({ error: `Product ${itemName} not found in restaurant menu` });
        }
    }
    // calculate total price automatically from product prices
    const totalPrice = items.reduce((sum, itemName) => {
        const product = existingRestaurant.products.find(p => p.name.toLowerCase() === itemName.toLowerCase());
        return sum + product.price;
    }, 0);
    //create order object
    const newOrder = {
        userId: userId,
        restaurantId: restaurantId,
        items: items,
        totalPrice: totalPrice,
        status: "pending"
    }
    const order = await Order.create(newOrder); // Saves directly to MongoDB    
    user.orders.push(order.id); //add the order to user's array
    await user.save();
    return res.location(`/api/orders/${order.id}`).status(201).json(order);
}

async function getOrdersByUser(req, res){
    const userId = req.user.userId; //get the user id from req.user, after token validation
    if (!userId){//user id is missing
        return res.status(400).json({error: "Missing user-id header"});
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const orders = await Order.find({ userId: userId });
    return res.status(200).json({orders: orders})
}

async function getOrderById(req, res){
    const orderId = req.params.id; //get the order id from the url
    const order = await Order.findById(orderId);
    if (!order){//order not found
        return res.status(404).json({error: "Order not found"});
    }
    return res.status(200).json({ order: order })
}

async function updateOrder(req, res){
    const orderId = req.params.id; //get the order id from the url
    const order = await Order.findById(orderId);
    if (!order){//order not found
        return res.status(404).json({error: "Order not found"});
    }
    const { items, status } = req.body;
    const updateData = {};
    if (items !== undefined) {
        const restaurant = await Restaurant.findById(order.restaurantId).populate('products');
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant no longer exists" });
        }
        for (const itemName of items) {
            const exists = restaurant.products.some(p => p.name.toLowerCase() === itemName.toLowerCase());
            if (!exists) {
                return res.status(404).json({ error: `Product ${itemName} not found in restaurant menu` });
            }
        }
        updateData.items = items;
        // recalculate total price automatically when items change
        updateData.totalPrice = items.reduce((sum, itemName) => {
            const product = restaurant.products.find(p => p.name.toLowerCase() === itemName.toLowerCase());
            return sum + product.price;
        }, 0);
    }
    if (status) 
        updateData.status = status;
    Object.assign(order, updateData);
    await order.save();
    return res.status(204).send();
}

async function deleteOrder(req, res){
    const orderId = req.params.id; //get the order id from the url
    const order = await Order.findById(orderId);
    if (!order){//order not found
        return res.status(404).json({error: "Order not found"});
    }
    await order.deleteOne(); //delete the order
    await User.updateOne(
        { _id: order.userId }, 
        { $pull: { orders: orderId } }
    );
    return res.status(204).send();
}
module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderById,
    updateOrder,
    deleteOrder
};