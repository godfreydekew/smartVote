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
        const findInvitationsQuery = `
            SELECT election_id FROM eligible_voters WHERE user_identifier = $1
        `;
        const invitedElections = await client.query(findInvitationsQuery, [userEmail]);

        if (invitedElections.rows.length === 0) {
            console.log(`No pending invitations found for email: ${userEmail}`);
            return;
        }

        console.log(`Found ${invitedElections.rows.length} pending invitations for ${userEmail}. Linking now...`);

        await client.query('BEGIN');
        for (const row of invitedElections.rows) {
            const linkUserQuery = `
                INSERT INTO user_participated_elections (user_id, election_id, has_voted)
                VALUES ($1, $2, false)
                ON CONFLICT (user_id, election_id) DO NOTHING
            `;
            await client.query(linkUserQuery, [userId, row.election_id]);
        }
        await client.query('COMMIT');

        console.log(`Successfully linked user ${userId} to their invited elections.`);

    } catch (error) {
        await client.query('ROLLBACK');
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
