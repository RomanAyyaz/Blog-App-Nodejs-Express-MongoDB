const jwt = require('jsonwebtoken');
const SecretKey = "mynameis$uperman";

const auth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next();
    }
    try {
        const verify = jwt.verify(token, SecretKey);
        req.user = verify;
        return next();
    } catch (error) {
        console.error('Token verification failed:', error);
        req.user = undefined;
        return next(error);
    }
};

module.exports = auth;
