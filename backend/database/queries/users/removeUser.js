const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function removeUser(userId) {
    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
      if (result.rows.length === 0) {
        throw new DatabaseError('User not found', 'USER_NOT_FOUND');
      }
      return result.rows[0]; 
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new DatabaseError('Error deleting user: ' + error.message);
    }
  }

  module.exports = {
    removeUser,
  }