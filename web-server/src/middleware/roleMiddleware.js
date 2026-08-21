

function requireRestaurant(req, res, next) {
    if (req.user.role === 'restaurant') //if the role is restaurant, call next function
        next();
    else
        return res.status(403).json({ error: "Forbidden" });
}
module.exports = requireRestaurant;