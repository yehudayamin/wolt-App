/*
 * Restaurant.js - Restaurant model
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    categories: { 
        type: [String], 
        default: [] 
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]

});

module.exports = mongoose.model('Restaurant', restaurantSchema);

