/*
 * User.js - Users model
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    role: {
        type: String, 
        default: 'user'
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }]

});

module.exports = mongoose.model('User', userSchema);

