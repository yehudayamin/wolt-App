

const jwt = require('jsonwebtoken');

function auth(req, res, next){
    const authHeader = req.headers['authorization'] //get the authorization header from the request
    if (!authHeader || !authHeader.startsWith("Bearer ")){ //check if the header is undefined, and check if starts with Bearer
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1]; //split the authHeader by spaces, then take the token
    const JWT_SECRET = process.env.JWT_SECRET || 'your_dev_secret'; 
    jwt.verify(token, JWT_SECRET, (err, decoded) => { 
        if (err){ //token is invalid
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = { userId: decoded.userId, username: decoded.username, role: decoded.role }; //add the user id and password to the request
        next(); //call next, send the request to the server...
    })
}

module.exports = auth