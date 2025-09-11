const { pool } = require('../../database/db');
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');
const { fetchElectionById } = require('../../database/queries/elections/fetchElection');
const { setMerkleRootOnContract } = require('../../utils/blockchain');

const finalizeElection = async (req, res) => {
  const { electionId } = req.params;

  try {
    const election = await fetchElectionById(electionId);

    if (!election) {
      return res.status(404).json({ error: 'Election not found.' });
    }

    if (election.status !== 'REGISTRATION') {
      return res.status(403).json({ error: 'This election is not in the registration phase.' });
    }

    // 1. Fetch all registered voters (user_identifier is the public key)
    const votersResult = await pool.query('SELECT user_identifier FROM eligible_voters WHERE election_id = $1', [electionId]);
    const voters = votersResult.rows.map(row => row.user_identifier);

    if (voters.length === 0) {
        return res.status(400).json({ error: 'Cannot finalize an election with no registered voters.' });
    }

    // 2. Generate Merkle Tree and Root
    const leaves = voters.map(pk => SHA256(pk));
    const tree = new MerkleTree(leaves, SHA256);
    const merkleRoot = tree.getRoot().toString('hex');

    // 3. Update Smart Contract
    // This is a placeholder for the blockchain interaction.
    const tx = await setMerkleRootOnContract(election.smart_contract_address, merkleRoot);
    console.log('Transaction hash for setting Merkle root:', tx.hash);

    // 4. Update database
    await pool.query(
      'UPDATE elections SET status = $1, merkle_root = $2, start_date = $3, end_date = $4 WHERE id = $5',
      ['UPCOMING', merkleRoot, req.body.startDate, req.body.endDate, electionId]
    );

    res.status(200).json({ message: 'Election finalized successfully. Voting can now begin.', merkleRoot });

  } catch (error) {
    console.error('Error finalizing election:', error);
    res.status(500).json({ error: 'Failed to finalize election.', details: error.message });
  }
};

module.exports = { finalizeElection };
