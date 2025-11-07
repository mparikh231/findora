const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ status: false, message: 'No token provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: false, message: 'Failed to authenticate token' });
            }
            console.log("Decoded JWT:", decoded);
            req.userId = decoded.userId;
            req.userRole = decoded.userRole;
            next();
        });
    } catch (error) {
        console.error('Error during token verification:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.userRole === 'admin') {
        next();
    } else {
        return res.status(403).json({ status: false, message: 'Access denied: Admins only' });
    }
};

module.exports = {
    verifyToken,
    isAdmin
};