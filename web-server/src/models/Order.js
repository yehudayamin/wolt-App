/*
 * Order.js - Order model
 *
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    restaurantId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Restaurant' 
    },
    items: { 
        type: [String], 
        default: [] 
    },
    totalPrice: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
