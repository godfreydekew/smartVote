const { pool } = require('../../db');
const { checkCriteria } = require('../../utils/criteria');

/**
 * Checks a user against all 'upcoming' elections with eligibility criteria
 * and adds them to the eligible_voters table if they match.
 * @param {object} user - The user object, typically after registration.
 * @returns {Promise<void>}
 */
async function addUserToEligibleElections(user) {
    const client = await pool.connect();
    try {
        // Get all UPCOMING elections that have eligibility criteria
        const electionsResult = await client.query(
            `SELECT id, type, kyc_required, age_restriction, regions FROM elections WHERE status = 'upcoming' AND (kyc_required = TRUE OR age_restriction IS NOT NULL OR regions IS NOT NULL)`
        );

        if (electionsResult.rows.length === 0) {
            return; // No relevant elections to check against
        }

        for (const election of electionsResult.rows) {
            const isEligible = checkCriteria(user, election);

            if (isEligible) {
                // Add user to the eligible_voters table, ignoring if they already exist
                await client.query(
                    `INSERT INTO eligible_voters (election_id, user_id, email) VALUES ($1, $2, $3) ON CONFLICT (election_id, user_id) DO NOTHING`,
                    [election.id, user.id, user.email]
                );
            }
        }
    } catch (error) {
        console.error('Error in addUserToEligibleElections query:', error);
        throw error; // Re-throw to be handled by the controller
    } finally {
        client.release();
    }
}

module.exports = {
    addUserToEligibleElections,
};
