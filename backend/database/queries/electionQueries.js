const { pool } = require('../db');
const { DatabaseError } = require('../utils/errors');


async function getElectionById(electionId) {
  try {
    const result = await pool.query(
      `SELECT e.*, o.name as organization_name
       FROM election e
       JOIN organization o ON o.id = e.organization_id
       WHERE e.id = $1`,
      [electionId]
    );

    if (!result.rows[0]) {
      throw new DatabaseError('Election not found', 'ELECTION_NOT_FOUND');
    }

    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Error fetching election: ' + error.message);
  }
}



async function updateElectionStatus(electionId, status) {
  try {
    const validStatuses = ['draft', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new DatabaseError('Invalid election status', 'INVALID_STATUS');
    }

    const result = await pool.query(
      `UPDATE election SET status = $2, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [electionId, status]
    );

    if (!result.rows[0]) {
      throw new DatabaseError('Election not found', 'ELECTION_NOT_FOUND');
    }

    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Error updating election status: ' + error.message);
  }
}

async function addElectionRule(electionId, ruleType, ruleParameters) {
  try {
    const result = await pool.query(
      `INSERT INTO election_rule (election_id, rule_type, rule_parameters, is_active)
       VALUES ($1, $2, $3, true) RETURNING *`,
      [electionId, ruleType, ruleParameters]
    );

    if (!result.rows[0]) {
      throw new DatabaseError('Failed to create election rule');
    }

    return result.rows[0];
  } catch (error) {
    if (error.code === '23503') {
      throw new DatabaseError('Election not found', 'ELECTION_NOT_FOUND');
    }
    throw new DatabaseError('Error creating election rule: ' + error.message);
  }
}

async function getElectionRules(electionId) {
  try {
    const result = await pool.query(
      'SELECT * FROM election_rule WHERE election_id = $1 AND is_active = true',
      [electionId]
    );
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Error fetching election rules: ' + error.message);
  }
}

async function recordVote(
  electionId,
  userId,
  candidate_id,
  transactionHash,
  zkProof,
  voteHash
) {
  try {
    // Check if user has already voted
    const hasVoted = await hasUserVoted(electionId, userId);
    if (hasVoted) {
      throw new DatabaseError('User has already voted', 'DUPLICATE_VOTE');
    }

    const result = await pool.query(
      `INSERT INTO vote_record (
        election_id, user_id, candidate_id,transaction_hash, zk_proof, vote_hash,
        voted_at, verification_status
      )
       VALUES ($1, $2, $3, $4, $5,$6, NOW(), 'pending') RETURNING *`,
      [electionId, userId, candidate_id, transactionHash, zkProof, voteHash]
    );

    if (!result.rows[0]) {
      throw new DatabaseError('Failed to record vote');
    }

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new DatabaseError(
        'Duplicate transaction hash',
        'DUPLICATE_TRANSACTION'
      );
    }
    throw new DatabaseError('Error recording vote: ' + error.message);
  }
}

async function getElectionVotes(electionId) {
  try {
    const result = await pool.query(
      'SELECT * FROM vote_record WHERE election_id = $1',
      [electionId]
    );
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Error fetching election votes: ' + error.message);
  }
}

async function hasUserVoted(electionId, userId) {
  try {
    const result = await pool.query(
      'SELECT EXISTS(SELECT 1 FROM vote_record WHERE election_id = $1 AND user_id = $2)',
      [electionId, userId]
    );
    return result.rows[0].exists;
  } catch (error) {
    throw new DatabaseError(
      'Error checking user vote status: ' + error.message
    );
  }
}
const addEligibleVoter = async (electionId, name, email) => {
  try {
    const result = await pool.query(
      `INSERT INTO eligible_voters (election_id, name, email) VALUES ($1, $2, $3) RETURNING *`,
      [electionId, name, email]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new DatabaseError(
        'Eligible voter already exists for this election.',
        'DUPLICATE_VOTER'
      );
    }
    throw new DatabaseError('Error adding eligible voter: ' + error.message);
  }
};

module.exports = {
  getElectionById,
  updateElectionStatus,
  addElectionRule,
  getElectionRules,
  recordVote,
  getElectionVotes,
  hasUserVoted,
  addEligibleVoter
};
