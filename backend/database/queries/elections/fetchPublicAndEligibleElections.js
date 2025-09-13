const { pool } = require('../../db');

/**
 * Fetches all public elections and elections a user is eligible for.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} - A list of elections.
 */
async function fetchPublicAndEligibleElections(userId) {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT * FROM elections WHERE type = 'public'
             UNION
             SELECT e.* FROM elections e
             JOIN eligible_voters ev ON e.id = ev.election_id
             WHERE ev.user_id = $1`,
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error in fetchPublicAndEligibleElections query:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    fetchPublicAndEligibleElections,
};
