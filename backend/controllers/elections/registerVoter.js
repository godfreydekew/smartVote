const { pool } = require('../../database/db');
const { fetchElectionById } = require('../../database/queries/elections/fetchElection');

const registerVoter = async (req, res) => {
  const { electionId } = req.params;
  const { publicKey } = req.body;

  if (!publicKey) {
    return res.status(400).json({ error: 'Public key is required.' });
  }

  try {
    const election = await fetchElectionById(electionId);

    if (!election) {
      return res.status(404).json({ error: 'Election not found.' });
    }

    if (election.status !== 'REGISTRATION') {
      return res.status(403).json({ error: 'This election is not in the registration phase.' });
    }

    // Using the generic eligible_voters table from the original schema
    await pool.query(
      'INSERT INTO eligible_voters (election_id, user_identifier) VALUES ($1, $2) ON CONFLICT (election_id, user_identifier) DO NOTHING',
      [electionId, publicKey]
    );

    res.status(200).json({ message: 'Successfully registered to vote in this election.' });

  } catch (error) {
    console.error('Error registering voter:', error);
    res.status(500).json({ error: 'Failed to register voter.', details: error.message });
  }
};

module.exports = { registerVoter };
