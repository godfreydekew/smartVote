const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function fetchAllElections() {
  try {
    const result = await pool.query(`SELECT * FROM elections`);
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Error fetching elections: ' + error.message);
  }
}

async function fetchElectionById(electionId) {
  try {
    const result = await pool.query(`
      SELECT e.*, json_agg(ev.public_key) as voters
      FROM elections e
      LEFT JOIN election_voters ev ON e.id = ev.election_id
      WHERE e.id = $1
      GROUP BY e.id
    `, [electionId]);
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Error fetching election: ' + error.message);
  }
}

async function fetchElectionsByStatus(status) {
  try {
    const result = await pool.query(`SELECT * FROM elections WHERE status = $1`, [status]);
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Error fetching elections: ' + error.message);
  }
}

module.exports = {
  fetchAllElections,
  fetchElectionById,
  fetchElectionsByStatus,
};