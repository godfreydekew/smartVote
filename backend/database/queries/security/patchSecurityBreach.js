const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function patchSecurityBreach(breachId, resolutionStatus) {
  try {
    await pool.query(`UPDATE breaches SET resolution_status = $1 WHERE id = $2 RETURNING *`, [
      resolutionStatus,
      breachId,
    ]);
    res.json({ success: true });
  } catch (error) {
    throw new DatabaseError('Error modifying security breach: ' + error.message);
  }
}

module.exports = {
  patchSecurityBreach,
};
