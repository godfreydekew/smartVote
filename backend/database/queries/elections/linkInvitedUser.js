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
        await client.query(
            `UPDATE eligible_voters SET user_id = $1 WHERE email = $2 AND user_id IS NULL`,
            [userId, email]
        );

        console.log(`Successfully linked user ${userId} to their invited elections.`);

    } catch (error) {
        console.error('Error linking invited user:', error);
        // Re-throw the error to be handled by the calling controller
        throw error;
    } finally {
        client.release();
    }
}


module.exports = {
    linkInvitedUser,
};
