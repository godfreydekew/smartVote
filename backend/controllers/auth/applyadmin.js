const { updateUserRole } = require('../../database/queries/userQueries.js');

const postApplyAdmin = async (req, res) => {
  const userId  = req.session.user.id;

  console.log('User ID from session:', userId);
  try {
    const updatedUser = await updateUserRole(userId, 'admin');
    res.status(200).json({ message: 'Admin application submitted successfully', user: updatedUser });

  } catch (error) {

    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }

     if (error.name === 'DatabaseError') {
      return res.status(400).json({ error: error.message, code: error.code });
     }
    res.status(500).json({ error: 'Failed to apply for admin role', details: error.message });
  }
}

module.exports = { postApplyAdmin };
