// authMiddleware.js
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      message: 'Authentication failed. No token provided.',
    });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, 'mysecretkey'); 

    req.userData = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Authentication failed. Invalid token.',
    });
  }
};

export const isAdmin = (req, res, next) => {
    console.log('User Data:', req.userData);
  
    if (req.userData.role !== 'admin') {
      // console.log('Access denied. Role:', req.userData.role);
      return res.status(403).json({
        message: 'Access denied. You are not an admin.',
      });
    }
  
    next();
  };
  
