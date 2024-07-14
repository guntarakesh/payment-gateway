const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // console.log(authHeader)

  if (!authHeader) {
    return res.status(401).redirect('/login');
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).redirect('/login');
  }
}

module.exports = authMiddleware;
