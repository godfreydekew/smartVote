const { fetchCandidatesByElectionId } = require('../../database/queries/candidates/fetchCandidate');

// Controller to fetch candidates for a specific election
const getCandidatesByElectionId = async (req, res) => {
  const { electionId } = req.params;

  try {
    const candidates = await fetchCandidatesByElectionId(electionId);

    if (candidates.length === 0) {
      return res.status(404).json({ message: 'No candidates found for this election' });
    }

    return res.status(200).json({ 
      message: 'Candidates fetched successfully', 
      candidates 
    });
    
  } catch (error) {
    console.log('Error getting candidates for an election', error);

    if (error.name === 'DatabaseError') {
      return res
        .status(400)
        .json({ message: 'Failed to get candidates from the database', error: error.message });
    }
    return res.send(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getCandidatesByElectionId };
