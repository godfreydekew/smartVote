const { getElection } = require('../../database/queries/elections/getElection.js');
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

const getMerkleProof = async (req, res) => {
  try {
    const { electionId, publicKey } = req.params;

    const election = await getElection(electionId);

    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (!election.voters) {
      return res.status(400).json({ error: 'Voters not found for this election' });
    }

    const leaves = election.voters.map(voter => SHA256(voter.publicKey));
    const tree = new MerkleTree(leaves, SHA256);
    const leaf = SHA256(publicKey);
    const proof = tree.getProof(leaf);
    const index = tree.getLeafIndex(leaf);

    res.status(200).json({ proof, index });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get Merkle proof',
      details: error.message,
    });
  }
};

module.exports = {
  getMerkleProof,
};
