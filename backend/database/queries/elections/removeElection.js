const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function removeElection(electionId) {
  try {
    const result = await pool.query('DELETE FROM elections WHERE id = $1', [electionId]);
  } catch (error) {
    if (error.code === '23503') {
      throw new DatabaseError('Election not found', 'ELECTION_NOT_FOUND');
    }

    throw new DatabaseError('Error deleting election: ' + error.message);
  }
}

module.exports = {
  removeElection,
};
