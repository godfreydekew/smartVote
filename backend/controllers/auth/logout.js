const { deleteKYCSession } = require('../utils/kycService');
const { updateUserKYCSession } = require('../../database/queries/users/kycQueries');

const logout = async (req, res) => {
  if (req.session) {
    console.log('Logging out user:', req.session.user);

    // Clear user session data Kyc
    // if (req.session.user?.kyc_session_id) {
    //   await deleteKYCSession(req.session.user.kyc_session_id);
    //   await updateUserKYCSession(req.session.user.id, null);
    // }

    req.session.destroy(err => {
      if (err) {
        // console.error('Error destroying session:', err);
        return res.status(500).json({
          status: 'error',
          message: 'Could not log out, please try again'
        });
      }

      res.clearCookie('connect.sid');

      return res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
      });
    });
  } else {
    return res.status(200).json({
      status: 'success',
      message: 'Already logged out'
    });
  }
};

module.exports = { logout };
