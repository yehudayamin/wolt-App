const express = require('express');
const mongoose = require('mongoose');

// don't let a bad request crash the server
process.on('unhandledRejection', (err) => console.error('Unhandled rejection:', err));

// expose `id` (string of _id) in responses so the web client keeps working
mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path'); //node.js module that helps us to build paths

// parse incoming JSON request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'))); //to serve static (files that stay the same after every request) files from public directory

// routes
const userRoutes = require('./src/routes/userRoutes');
const tokenRoutes = require('./src/routes/tokenRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const searchRoutes = require('./src/routes/searchRoutes');

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/wolt')
    .then(() => {
        console.log('Connected to MongoDB!');
        seedData().catch(err => console.error('Seed error:', err));
    //create 3 default restaurants
    })
    .catch(err => console.error('Connection failed:', err));


// mount all routes under /api
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html'))); // * means every other route (not /api....)

//add some default restaurants with default products
const Restaurant = require('./src/models/Restaurant');
const Product = require('./src/models/Product');

async function seedData(){
    console.log('SEED: starting...');
    const existing = await Restaurant.findOne({ name: 'Pizza Roma' });
    console.log('SEED: existing check done, found:', !!existing);
    if (existing) return;

    const r1 = await Restaurant.create({
    name: 'Pizza Roma',
    address: 'Dizengoff 1, Tel Aviv',
    phoneNumber: '0521234567',
    description: 'Authentic Italian pizza',
    categories: ['Pizza', 'Italian'],
    lat: 32.0800,
    lng: 34.7740
    });
    await Product.create({ name: 'Margherita', description: 'Tomato, mozzarella, basil', price: 52, restaurantId: r1._id })
    await Product.create({ name: 'Pepperoni', description: 'Tomato, mozzarella, pepperoni', price: 58, restaurantId: r1._id })

    const products1 = await Product.find({restaurantId : r1._id})
    r1.products = products1.map(p => p._id);
    await r1.save();

    const r2 = await Restaurant.create({
        name: 'Burger Boss',
        address: 'Rothschild 22, Tel Aviv',
        phoneNumber: '0531234567',
        description: 'Best burgers in town',
        categories: ['Burgers'],
        lat: 32.0650,
        lng: 34.7750
    });

    await Product.create({ name: 'Classic Burger', description: 'Beef patty, lettuce, tomato', price: 62, restaurantId: r2._id })
    await Product.create({ name: 'BBQ Burger', description: 'Beef patty, BBQ sauce, onion rings', price: 68, restaurantId: r2._id })
    
    const products2 = await Product.find({restaurantId : r2._id})
    r2.products = products2.map(p => p._id);
    await r2.save();

    const r3 = await Restaurant.create({
        name: 'Sushi Bar',
        address: 'Ben Yehuda 5, Tel Aviv',
        phoneNumber: '0541234567',
        description: 'Fresh sushi and Japanese cuisine',
        categories: ['Sushi'],
        lat: 32.0820,
        lng: 34.7680
    });
   
    await Product.create({ name: 'Salmon Roll', description: '8 pieces of fresh salmon roll', price: 48, restaurantId: r3._id })
    await Product.create({ name: 'Tuna Sashimi', description: '6 pieces of fresh tuna', price: 55, restaurantId: r3._id })
    
    const products3 = await Product.find({restaurantId : r3._id})
    r3.products = products3.map(p => p._id);
    await r3.save();

}



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});