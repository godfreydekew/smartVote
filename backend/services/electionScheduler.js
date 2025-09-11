const cron = require('node-cron');
const { pool } = require('../database/db');
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');
const { setMerkleRootOnContract } = require('../utils/blockchain');

const finalizeElectionTask = async (election) => {
  console.log(`Finalizing election ID: ${election.id}`);
  try {
    // 1. Fetch all registered voters
    const votersResult = await pool.query('SELECT user_identifier FROM eligible_voters WHERE election_id = $1', [election.id]);
    const voters = votersResult.rows.map(row => row.user_identifier);

    if (voters.length === 0) {
      console.log(`Election ID: ${election.id} has no voters. Marking as cancelled.`);
      await pool.query("UPDATE elections SET status = 'CANCELLED' WHERE id = $1", [election.id]);
      return;
    }
    if (!election.smart_contract_address) {
        console.error(`Cannot finalize election ID: ${election.id}. Missing smart contract address.`);
        await pool.query("UPDATE elections SET status = 'CANCELLED' WHERE id = $1", [election.id]); // Or a new 'FAILED' status
        return;
    }

    // 2. Generate Merkle Tree and Root
    const leaves = voters.map(pk => SHA256(pk));
    const tree = new MerkleTree(leaves, SHA256);
    const merkleRoot = tree.getRoot().toString('hex');

    // 3. Update Smart Contract
    console.log(`Calling smart contract for Election ID: ${election.id} with Merkle Root: ${merkleRoot}`);
    await setMerkleRootOnContract(election.smart_contract_address, merkleRoot);

    // 4. Update database status to UPCOMING
    await pool.query("UPDATE elections SET status = 'UPCOMING', merkle_root = $1 WHERE id = $2", [merkleRoot, election.id]);
    console.log(`Election ID: ${election.id} finalized successfully.`);

  } catch (error) {
    console.error(`Failed to finalize election ID: ${election.id}`, error);
    // Optionally, update status to 'FAILED'
  }
};

const electionScheduler = () => {
  // Schedule a job to run every minute
  cron.schedule('* * * * *', async () => {
    console.log('Running scheduled job: Checking for elections to finalize...');
    try {
      const result = await pool.query(
        "SELECT * FROM elections WHERE status = 'REGISTRATION' AND finalization_date IS NOT NULL AND finalization_date <= NOW()"
      );

      const electionsToFinalize = result.rows;
      if (electionsToFinalize.length > 0) {
        console.log(`Found ${electionsToFinalize.length} election(s) to finalize.`);
        for (const election of electionsToFinalize) {
          await finalizeElectionTask(election);
        }
      } else {
        console.log('No elections to finalize at this time.');
      }
    } catch (error) {
      console.error('Error in scheduled job:', error);
    }
  });

  console.log('Election scheduler has been initialized.');
};

module.exports = { electionScheduler };
