const jwt = require('jsonwebtoken');

const generateToken =  (userId, userPassword) => {
    return jwt.sign({ userId, userPassword }, 'secretKey', { expiresIn: '1h' });
} 
module.exports = {generateToken};
