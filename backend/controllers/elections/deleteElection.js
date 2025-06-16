const { removeElection } = require('../../database/queries/elections/removeElection.js');

/**
 * Deletes an election by its ID.
 * Returns success if deletion is completed,
 * or appropriate error if the election is not found or deletion fails.
 */
const deleteElection = async (req, res) => {
  const { electionId } = req.params;

  try {
    //attempt to dleete the election from the database
    await removeElection(electionId);

    res.status(200).json({ message: 'Election deleted successfully' });
  } catch (error) {
    console.error('Error deleting election:', error);

    //check if the error was casue becasue the election does not exist
    if (error.code === 'ELECTION_NOT_FOUND') {
      return res.status(404).json({ error: 'Election not found' });
    }

    res.status(500).json({
      error: 'Failed to delete election',
      details: error.message,
    });
  }
};

module.exports = {
  deleteElection,
};
