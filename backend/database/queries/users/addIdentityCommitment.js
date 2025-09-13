const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function addIdentityCommitment(userId, identitycommitment) {
  try {
    const query = `UPDATE users SET identitycommitment = $1 WHERE id = $2`;
    const values = [identitycommitment, userId];
    const result = await pool.query(query, values);
  } catch (error) {
    console.error('Error adding identity commitment:', error);
    throw new DatabaseError('Error adding identity commitment: ' + error.message);
  }
}

module.exports = { addIdentityCommitment };
