const { pool } = require('../../db');

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

/**
 * Checks if a user meets the defined criteria.
 * @param {object} user - The user object.
 * @param {object} election - The election object containing eligibility criteria.
 * @returns {boolean} - True if the user meets all criteria, false otherwise.
 */
function checkCriteria(user, election) {
    // KYC requirement
    if (election.kyc_required && !user.kyc_verified) {
        return false;
    }

    // Age restriction
    if (election.age_restriction && election.age_restriction.length === 2) {
        const minAge = election.age_restriction[0];
        const maxAge = election.age_restriction[1];
        if (user.age === null || user.age < minAge || user.age > maxAge) {
            return false;
        }
    }

    // Region restriction
    if (election.regions && election.regions.length > 0) {
        if (!user.country_of_residence || !election.regions.includes(user.country_of_residence)) {
            return false;
        }
    }

    return true; // User passed all checks
}

module.exports = {
    addUserToEligibleElections,
};