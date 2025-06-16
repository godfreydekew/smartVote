const { getUserById, getUserByEmail } = require('../../database/queries/userQueries.js');

const getUserByIdController = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserByEmailController = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
    getUserByIdController,
    getUserByEmailController,
}