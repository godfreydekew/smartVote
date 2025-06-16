const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function fetchCandidateById(candidateId) {
  try {
    const result = await pool.query('SELECT * FROM candidates WHERE id = $1', [candidateId]);
    
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Error fetching candidate: ' + error.message);
  }
}

async function fetchCandidatesByElectionId(electionId) {
  try {
    const result = await pool.query('SELECT * FROM candidates WHERE election_id = $1', [
      electionId,
    ]);

    return result.rows;
  } catch (error) {
    throw new DatabaseError('Error fetching candidates: ' + error.message);
  }
}

module.exports = {
  fetchCandidateById,
  fetchCandidatesByElectionId,
};
