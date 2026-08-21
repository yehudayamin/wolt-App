
/*
 * productController.js - Handles HTTP requests for Product (menu item) operations
 */

const Restaurant = require("../models/Restaurant");
const Product = require('../models/Product');
const User = require('../models/User');
const { registerView, deleteView } = require('../services/viewsClient');


// Handles: GET /api/restaurants/:id/products
async function getProductsByRestaurant(req, res)
{
    const restarauntID= req.params.id;
    const item = await Restaurant.findById(restarauntID);
    if (!item) return res.status(404).json({error : "Restaurant not found"});
    const products = await Product.find({ restaurantId: restarauntID });
    return res.json(products);
}

//  Handles: POST /api/restaurants/:id/products
//  Returns 201 Created with Location header: /api/restaurants/:id/products/:pId

async function createProduct(req, res)
{
    const restarauntID= req.params.id;
    const item = await Restaurant.findById(restarauntID);
    if (!item) return res.status(404).json({error : "Restaurant not found"});
    const data = req.body;

    if (!data.name || !data.price || !data.description || typeof data.price !== 'number' || data.price <= 0)
    //If the product does not include at least the name field, price and description
    // an error should be returned.
    {
        return res.status(400).json({error: "Missing required fields"});
    }

    const newProduct = new Product({ ...data, restaurantId: restarauntID });
    await newProduct.save();
    item.products.push(newProduct._id); //pushes the new product into the restaurant's products array
    await item.save();
    return res.status(201).location(`/api/restaurants/${restarauntID}/products/${newProduct.id}`).json(newProduct);
}

// Handles: GET /api/restaurants/:id/products/:pId
// Retrieves a single product by ID and notifies the C++ server that the user viewed it.
async function getProductById(req, res)
{
    const restarauntID= req.params.id;
    const item = await Restaurant.findById(restarauntID);
    if (!item) return res.status(404).json({error : "Restaurant not found"});
    const productId = req.params.pId;
    const product = await Product.findById(productId); //find the product.
    if (!product || product.restaurantId.toString() !== restarauntID) return res.status(404).json({error: "Product not found"});

    const userId = req.user.userId; //get user id from user.userId, after token validation
    if (!userId) return res.status(400).json({ error: "Missing user-id header" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    await registerView(userId, productId); // notify the C++ server that this user viewed this product

    return res.json(product); //return autumticlly 200 Ok
}

//  Handles: PATCH /api/restaurants/:id/products/:pId
//Updates the product in both Product model and restaurant's products array

async function updateProduct(req, res)
{
    const restarauntID= req.params.id;
    const item = await Restaurant.findById(restarauntID);
    if (!item) return res.status(404).json({error : "Restaurant not found"});
    const productId = req.params.pId;
    const product = await Product.findById(productId); //find the product.
    if (!product || product.restaurantId.toString() !== restarauntID) return res.status(404).json({error: "Product not found"});

    const newData = req.body; // the new data
    if (newData.price && (typeof newData.price !== 'number' || newData.price <= 0)) {
        return res.status(400).json({ error: "price must be a positive number" });
    }
    Object.assign(product, newData);//update the product
    await product.save();

    return res.status(204).send(); // returns 204 on success.
}

//  *   deleteProduct(req, res)
//  *     Handles: DELETE /api/restaurants/:id/products/:pId
//  *     - Removes product from both Product model and restaurant's products array
//  *     - Returns 204 No Content on success

async function deleteProduct(req, res)
{
    const restarauntID= req.params.id;
    const item = await Restaurant.findById(restarauntID);
    if (!item) return res.status(404).json({error : "Restaurant not found"});
    const productId = req.params.pId;
    const product = await Product.findById(productId); //find the product.
    if (!product|| product.restaurantId.toString() !== restarauntID.toString()) return res.status(404).json({error: "Product not found"});

    await product.deleteOne(); //delete the product from Product array.
    item.products.pull(productId);
    await item.save();

    const allUsers = await User.find({}, '_id');
    await Promise.all(allUsers.map(u => deleteView(u._id, productId)));

    return res.status(204).send(); // returns 204 on success.
}

module.exports = { getProductsByRestaurant, createProduct, getProductById, updateProduct, deleteProduct };
