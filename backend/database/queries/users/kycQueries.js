const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function updateUserKYCSession(userId, sessionId) {
  try {
    console.log('Updating KYC session for user:', userId, 'with session ID:', sessionId);
    const query = `
      UPDATE users 
      SET kyc_session_id = $1
      WHERE id = $2
      RETURNING *`;
    const values = [sessionId, userId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new DatabaseError('User not found', 'USER_NOT_FOUND');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user KYC session:', error);
    throw new DatabaseError('Error updating user KYC session: ' + error.message);
  }
}

async function getUserWithKYCSession(userId) {
  try {
    const query = `
      SELECT *, 
      (kyc_session_id IS NOT NULL) as is_kyc_verified
      FROM users WHERE id = $1`;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      throw new DatabaseError('User not found', 'USER_NOT_FOUND');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user with KYC session:', error);
    throw new DatabaseError('Error getting user with KYC session: ' + error.message);
  }
}

module.exports = {
  updateUserKYCSession,
  getUserWithKYCSession,
};
