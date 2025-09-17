const { pool } = require('../../db');

/**
 * Updates the eligible_voters table to link a user account to a pending invitation.
 * This is used when a user with an invited email address registers for the first time.
 * @param {number} userId - The ID of the newly registered user.
 * @param {string} email - The email of the newly registered user.
 * @returns {Promise<void>}
 */
async function linkInvitedUser(userId, userEmail) {
    const client = await pool.connect();
    try {
      const sql = `
        UPDATE eligible_voters
        SET user_id = $1
        WHERE LOWER(email) = LOWER($2)
          AND (user_id IS NULL)
        RETURNING id, election_id, email;
      `;
      const params = [userId, userEmail];
  
      const result = await client.query(sql, params);
  
      if (result.rowCount > 0) {
        console.log(`Successfully linked user ${userId} to ${result.rowCount} invited eligible_voters rows.`);
        result.rows.forEach(r => console.log('linked eligible_voter:', r));
      } else {
        console.log(`No invited eligible_voters found for email=${userEmail}`);
      }
  
      return result.rows;
    } catch (error) {
      console.error('Error linking invited user:', error);
      throw error; 
    } finally {
      client.release();
    }
  }


module.exports = {
    linkInvitedUser,
};
