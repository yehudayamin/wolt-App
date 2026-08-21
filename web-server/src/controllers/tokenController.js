
/*
 * tokenController.js - Handles login (token creation)
*/

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_dev_secret';

async function login(req, res){
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password ){//if one (or more) of the fields are empty
            return res.status(400).json({error: "Missing required fields"}); //return 400 status code
        }
    //check if user doesnt exists
    const existingUser = await User.findOne({username: username});
    if (!existingUser) {
        return res.status(404).json({error: "User doesn't exists"});
    }
    //check if password is correct
    if (existingUser.password !== password){
        return res.status(401).json({ error: "Incorrect password" });
    }
    const token = jwt.sign({ userId: existingUser.id, username: existingUser.username, role: existingUser.role }, JWT_SECRET, { expiresIn: '24h' }) //create the token
    //everything is ok, return 200 with id and token
    return res.status(200).json({ token: token, userId: existingUser.id }) //send user id + token...
}
module.exports = {
    login
};