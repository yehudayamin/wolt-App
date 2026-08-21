/*
 * restaurantController.js - Handles HTTP requests for Restaurant operations
 */

const Restaurant = require('../models/Restaurant');


// Handles: GET /api/restaurants
// Returns 200 OK with array of all restaurants as JSON
// Returns empty array [] if no restaurants exist (not an error)
async function getAllRestaurants(req, res)
{
    //res.json always send 200 OK autumaticlly.
    const restaurants = await Restaurant.find();
    res.json(restaurants); //send array of all restaruants as JSON, empty array if no restarants exsist.
}


//  Handles: POST /api/restaurants
//  Validates that required fields are present 
//  If validation fails: returns 400 Bad Request with error message
//  Calls Restaurant.add(data), returns 201 Created
async function createRestaurant(req, res)
{
    const data = req.body;
    const lat = req.body.lat || 32.0853;//default is tel aviv
    const lng = req.body.lng || 34.7818;//default is tel aviv
    
    if (!data.name || !data.address || !data.phoneNumber || !data.description)
    {
        return res.status(400).json({error: "Missing required fields"});
    }
    // validate phoneNumber - digits only
    if (!/^\d+$/.test(data.phoneNumber)) {
        return res.status(400).json({ error: "Phone must contain digits only" });
    }
    if (!data.categories){ //if categories is not provided
        data.categories = [];
    }
    if (!Array.isArray(data.categories)){//check for categories array
        return res.status(400).json({ error: "categories must be an array" });
    }
    const exists = await Restaurant.findOne({name: data.name});
    if (exists)
    {
        return res.status(409).json({ error: "Conflict" });
    }
    data.lat = lat;
    data.lng = lng;
    data.ownerId = req.user.userId;
    const newRestaurant = new Restaurant(data);
    const restaurant = await newRestaurant.save(); //add restarant
    return res.status(201).location(`/api/restaurants/${restaurant.id}`).json(restaurant);
}

// Handles: GET /api/restaurants/:id
// If not found: returns 404 Not Found with error message
// If found: returns 200 OK with restaurant object as JSON
async function getRestaurantById(req, res)
{
   const id = req.params.id;
   const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({error : "Restaurant not found"});
    return res.json(restaurant);
}

//Handles: PATCH /api/restaurants/:id
async function updateRestaurant(req, res)
{
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({error : "Restaurant not found"});
    const newData = req.body; // the new data
    if (newData.phoneNumber && !/^\d+$/.test(newData.phoneNumber)) {
        return res.status(400).json({ error: "Phone must contain digits only" });
    }
    if (newData.categories !== undefined && !Array.isArray(newData.categories)){//check if catagories is array
        return res.status(400).json({ error: "categories must be an array" });
    }
    if (restaurant.ownerId.toString() !== req.user.userId) return res.status(403).json({ error: "You are not the owner of this restaurant" });
    Object.assign(restaurant, newData); //copy all fields from newData into restaurant
    await restaurant.save();
    return res.status(204).send(); //return 204 No Content on success
}


// Handles: DELETE /api/restaurants/:id
async function deleteRestaurant(req, res)
{
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({error : "Restaurant not found"});
    if (restaurant.ownerId.toString() !== req.user.userId) return res.status(403).json({ error: "You are not the owner of this restaurant" });
    await restaurant.deleteOne(); //delete the restaurant.
    return res.status(204).send(); // returns 204 on success.
}

module.exports = { getAllRestaurants, createRestaurant, getRestaurantById, updateRestaurant, deleteRestaurant };