const { pool } = require('../../db');

/**
 * Adds a list of invited emails to the eligible_voters table for a specific election.
 * The user_id will be NULL initially, to be linked upon user registration.
 * @param {number} electionId - The ID of the election.
 * @param {Array<string>} invitedEmails - An array of email addresses to invite.
 * @returns {Promise<void>}
 */
async function addInvitedEmailsToEligibleVoters(electionId, invitedEmails) {
    if (!invitedEmails || invitedEmails.length === 0) {
        return;
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const query = `
            INSERT INTO eligible_voters (election_id, email, user_id)
            VALUES ($1, $2, NULL)
            ON CONFLICT (election_id, email) DO NOTHING;
        `;

        for (const email of invitedEmails) {
            await client.query(query, [electionId, email]);
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding invited emails to eligible voters:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    addInvitedEmailsToEligibleVoters,
};
