const { pool } = require('../../database/db');
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');
const { fetchElectionById } = require('../../database/queries/elections/fetchElection');
const { setMerkleRootOnContract } = require('../../utils/blockchain');

const finalizeElectionNow = async (req, res) => {
  const { electionId } = req.params;

  try {
    const election = await fetchElectionById(electionId);

    if (!election) {
      return res.status(404).json({ error: 'Election not found.' });
    }
    if (!election.smart_contract_address) {
        return res.status(400).json({ error: 'This election does not have a smart contract address.' });
    }
    if (election.status !== 'REGISTRATION') {
      return res.status(403).json({ error: 'This election is not in the registration phase and cannot be manually finalized.' });
    }

    const votersResult = await pool.query('SELECT user_identifier FROM eligible_voters WHERE election_id = $1', [electionId]);
    const voters = votersResult.rows.map(row => row.user_identifier);

    if (voters.length === 0) {
        return res.status(400).json({ error: 'Cannot finalize an election with no registered voters.' });
    }

    const leaves = voters.map(pk => SHA256(pk));
    const tree = new MerkleTree(leaves, SHA256);
    const merkleRoot = tree.getRoot().toString('hex');

    // Update Smart Contract
    await setMerkleRootOnContract(election.smart_contract_address, merkleRoot);

    // Update database status and merkle root
    await pool.query(
      "UPDATE elections SET status = 'UPCOMING', merkle_root = $1 WHERE id = $2", 
      [merkleRoot, electionId]
    );

    res.status(200).json({ message: 'Election finalized successfully.', merkleRoot });

  } catch (error) {
    console.error('Error finalizing election manually:', error);
    res.status(500).json({ error: 'Failed to finalize election manually.', details: error.message });
  }
};

module.exports = { finalizeElectionNow };
