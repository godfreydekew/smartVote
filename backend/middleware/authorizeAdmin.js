const authorizeAdmin = (req, res, next) => {
    // This middleware assumes that the `authenticateSession` middleware has already run
    // and attached the user's session information to req.session.
    
    if (req.session && req.session.user && req.session.user.user_role === 'admin') {
        // User is an admin, proceed to the next middleware or route handler
        return next();
    } else {
        // User is not an admin or there is no session
        return res.status(403).json({ error: 'Forbidden: You do not have administrative privileges.' });
    }
};

module.exports = authorizeAdmin;