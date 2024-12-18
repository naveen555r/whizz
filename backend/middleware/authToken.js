const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
  try {
    const token = req.cookies?.token; // Read token from cookies
    console.log('Token extracted from cookies:', token);

    if (!token) {
      return res.status(401).json({ message: "Token not found. Please log in." });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      console.log('Decoded token payload:', decoded);

      if (err) {
        console.error('Token error:', err);
        return res.status(401).json({ message: 'Invalid token.' });
      }

      if (decoded && decoded._id) {
        req.userId = decoded._id; // Set userId to decoded token's _id
        console.log('Decoded _id set to req.userId:', req.userId);
        next(); // Continue to the next middleware
      } else {
        return res.status(401).json({ message: 'Invalid token payload.' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = authToken;
