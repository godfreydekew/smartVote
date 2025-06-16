const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function removeCandidate(candidateId) {
  try {
    const result = await pool.query('DELETE FROM candidates WHERE id = $1 RETURNING *', [
      candidateId,
    ]);
    
    if (result.rowCount === 0) {
      throw new DatabaseError('Candidate not found', 'CANDIDATE_NOT_FOUND');
    }
    
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Error deleting candidate: ' + error.message);
  }
}

module.exports = {
  removeCandidate,
};
