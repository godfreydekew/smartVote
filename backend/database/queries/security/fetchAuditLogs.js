const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function fetchAllAuditLogs() {
  try {
    const result = await pool.query(
      `SELECT * FROM security_audit_logs ORDER BY check_time DESC LIMIT 100`
    );
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Error fetching audit logs: ' + error.message);
  }
}

async function fetchAuditLogsByElectionId(electionId) {
  try {
    const result = await pool.query(
      `SELECT * FROM security_audit_logs 
       WHERE election_id = $1 
       ORDER BY check_time DESC`,
      [electionId]
    );
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Error fetching election: ' + error.message);
  }
}

module.exports = {
  fetchAllAuditLogs,
  fetchAuditLogsByElectionId,
};
