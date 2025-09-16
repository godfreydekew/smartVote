const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function fetchAllSecurityBreaches() {
  try {
    const result = await pool.query(`SELECT * FROM breaches ORDER BY detected_at DESC LIMIT 100`);
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Error fetching security breaches: ' + error.message);
  }
}

async function fetchSecurityBreachById(breachId) {
  try {
    const result = await pool.query(`SELECT * FROM breaches WHERE id = $1`, [breachId]);
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Error fetching security breach: ' + error.message);
  }
}

module.exports = {
  fetchAllSecurityBreaches,
  fetchSecurityBreachById,
};
