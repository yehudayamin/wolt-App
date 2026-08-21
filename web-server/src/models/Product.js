/*
 * Product.js - Product model (menu item)
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    image: {
        type: String
    },
    description: {
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model('Product', productSchema);

