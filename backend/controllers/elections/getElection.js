const {
  fetchAllElections,
  fetchElectionById,
  fetchElectionsByStatus,
} = require('../../database/queries/elections/fetchElection');
const { fetchPublicAndEligibleElections } = require('../../database/queries/elections/fetchPublicAndEligibleElections');

// Fetch all elections
const getElections = async (req, res) => {
  try {
    const user = req.session.user;
    let elections;

    if (user && user.role === 'admin') {
      elections = await fetchAllElections();
    } else if (user) {
      elections = await fetchPublicAndEligibleElections(user.id);
    }

    res.status(200).json({ elections });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch elections',
      details: error.message,
    });
  }
};

// Fetch single election by ID
const getElection = async (req, res) => {
  const { electionId } = req.params;

  try {
    const election = await fetchElectionById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.status(200).json({ election });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch election',
      details: error.message,
    });
  }
};

// Fetch elections filtered by status
const getElectionsByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const elections = await fetchElectionsByStatus(status);
    if (!elections || elections.length === 0) {
      return res.status(404).json({
        message: 'No elections found with the given status',
      });
    }

    res.status(200).json({ elections });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch elections by status',
      details: error.message,
    });
  }
};

module.exports = {
  getElections,
  getElection,
  getElectionsByStatus,
};
