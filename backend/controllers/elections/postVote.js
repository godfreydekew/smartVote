const { recordVote, checkHasVoted } = require('../../database/queries/elections/recordVotes.js');
const { DatabaseError, handlePostgresError } = require('../../database/utils/errors.js');

const postVote = async (req, res) => {
  const { electionId } = req.params;
  const userId = req.session.user.id;

  try {
    const updatedElection = await recordVote(electionId, userId);

    if (!updatedElection) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.status(200).json({
      message: 'Vote updated successfully',
      election: updatedElection,
    });
  } catch (error) {
    console.error('Error updating votes:', error);

    if (error instanceof DatabaseError) {
      if (error.code === 'USER_ALREADY_VOTED') {
        return res.status(400).json({ message: 'User has already voted in this election' });
      }
      return res.status(400).json({
        message: 'Invalid data input',
        error: error.message,
      });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

const hasVoted = async (req, res) => {
  const { electionId } = req.params;
  const userId = req.session.user.id;

  try {
    const hasVoted = await checkHasVoted(electionId, userId);
    res.status(200).json({ hasVoted });
  } catch (error) {
    console.error('Error checking vote status:', error);
    if (error instanceof DatabaseError) {
      return res.status(400).json({
        message: 'Invalid data input',
        error: error.message,
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  postVote,
  hasVoted,
};
