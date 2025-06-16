function authenticateSession(req, res, next) {
//   console.log(req.session);
  if (req.session.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized: Please log in." });
  }
}

module.exports = authenticateSession;
