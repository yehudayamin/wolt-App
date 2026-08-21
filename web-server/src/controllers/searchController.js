/*
 * searchController.js - Handles search requests
 *
 */

const Product = require('../models/Product');
const Restaurant = require('../models/Restaurant');

async function search(req,res)
{
    const query = req.params.query.toLowerCase(); //convert the string to lower case.
    if (!query) return res.status(400).json({error : "query not found"});

    //filter only restaurants that includes query in name or descriptions.
    const restaurants = await Restaurant.find({
        $or: [
            {name: {$regex: query, $options: 'i'}},
            {description: {$regex: query, $options: 'i'}}
        ]
    });

    //filter only products that includes query in name or descriptions.
    const products = await Product.find({
        $or: [
            {name: {$regex: query, $options: 'i'}},
            {description: {$regex: query, $options: 'i'}}
        ]
    });

    return res.json({ restaurants, products });

}

module.exports = { search };