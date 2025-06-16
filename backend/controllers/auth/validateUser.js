
/**
 * Checks if the user has an active session.
 * Returns user info if session is valid, otherwise returns 401.
 */
const checkSession = (req, res) => {
    if (req.session && req.session.user) {
      
      return res.status(200).json({
        status: 'success',
        isLoggedIn: true,
        user: req.session.user
      });

    } else {
      return res.status(401).json({
        status: 'fail',
        isLoggedIn: false,
        message: 'No active session found'
      });
    }
  };
  
  module.exports = { checkSession };
