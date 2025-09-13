const { updateUser } = require('../../database/queries/userQueries.js');
const { addIdentityCommitment } = require('../../database/queries/users/addIdentityCommitment.js');

const updateUserController = async (req, res) => {
  const { userId } = req.params;
  const { fullName, ipfsProfileHash, metadata, isActive } = req.body;

  try {
    const updatedUser = await updateUser(userId, fullName, ipfsProfileHash, metadata, isActive);

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.name === 'DatabaseError') {
      res.status(400).json({ message: 'Invalid data input', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

const updateUserIdentityCommitment = async (req, res) => {
  const { userId } = req.params;
  const { identitycommitment } = req.body;

  try {
    await addIdentityCommitment(userId, identitycommitment);
    res.status(200).json({ message: 'User identity commitment updated successfully' });
  } catch (error) {
    console.error('Error updating user identity commitment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { updateUserController, updateUserIdentityCommitment };
