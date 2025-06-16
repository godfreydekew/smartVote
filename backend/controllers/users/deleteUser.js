const { removeUser } = require('../../database/queries/users/removeUser');

const deleteUser = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const deletedUser = await removeUser(userId);
    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    console.error('Error deleting user:', error);

    if (error.name === 'DatabaseError') {
      res.status(400).json({
        message: 'Invalid data input',
        error: error.message,
      });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = { deleteUser };
