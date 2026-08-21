
/*
 * userController.js - Handles HTTP requests for User operations
 */

const User = require('../models/User');

async function createUser(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const email = req.body.email;
    const image = req.body.image; //get the base64 image
    const role = req.body.role || 'user'; //get the role (user or restaurant owner), if null the defualt is user
    const lat = req.body.lat || 32.0853;//default is tel aviv
    const lng = req.body.lng || 34.7818;//default is tel aviv

    if (!username || !password || !name || !phone || !email){
    return res.status(400).json({error: "Missing required fields"});
    }
    if (role === 'user' && (!address || !image)){
        return res.status(400).json({error: "Missing required fields"});
    }
    // validate phone - digits only
    if (!/^\d+$/.test(phone)) {
        return res.status(400).json({ error: "Phone must contain digits only" });
    }
    if (!/\d/.test(password) || password.length < 8 || !/[a-zA-Z]/.test(password)){ //validate password - Password must be at least 8 characters and contain letters and digits
        return res.status(400).json({ error: "Password must be at least 8 characters and contain letters and digits" });
    }
    if (!email.includes("@") || !(email.split("@")[1].includes("."))){  //email must match valid format (contains @ and domain)
        return res.status(400).json({ error: "Invalid email format" });
    }
    //check if user already exists
    const existingUser = await User.findOne({ username: username }); //find by username using mongo findOne
    if (existingUser) {
        return res.status(409).json({error: "User already exists"});
    }
    //if everything is ok, create the user
    const newUser = new User({username, password, name, phone, email, role})
    if (address) newUser.address = address;
    if (image) newUser.image = image;
    if (lat) newUser.lat = lat;
    if (lng) newUser.lng = lng;
    await newUser.save();
    const { password: _pwd, ...userWithoutPassword } = newUser.toObject(); //exclude password from response

    //return 201, with the location api/users/id
    return res.location(`/api/users/${newUser.id}`).status(201).json(userWithoutPassword);
}

async function getUserById(req,res){
    const id = req.params.id;//get user's id from the url /api/users/:id, cast it to number
    const user = await User.findById(id);// await = wait for the answer
    if (!user){//if user doesn't exits
         return res.status(404).json({error: "User doesn't exists"});
    }
    //user was found
    //after this line, password will have the password, and userWithoutPass will have all fields except of the password
    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(200).json(userWithoutPassword);
}
async function updateUser(req, res){
    const newData = req.body; // the new data
    // validate phone - digits only
    if (newData.phone !== undefined && !/^\d+$/.test(newData.phone)) {
        return res.status(400).json({ error: "Phone must contain digits only" });
    }
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return res.status(404).json({ error: "User not found" });
    Object.assign(user, newData); //copy all fields from newData into user
    await user.save();
    return res.status(204).send();
}
module.exports = {
    createUser,
    getUserById,
    updateUser
};
