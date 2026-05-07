const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next) {
  const token = req.header('auth-token')

  if (!token) {
    return res.status(401).json({
      message: 'No Token. Please Login',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Session Expired. Please Login Again',
      })
    }

    return res.status(401).json({
      message: 'Please Ensure You Are Login.',
    })
  }
}
