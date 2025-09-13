const { pool } = require('../../db');

/**
 * Finds all users who meet the criteria for a given election and adds them to the eligible_voters table.
 * @param {object} election - The election object.
 * @returns {Promise<void>}
 */
async function addEligibleUsersToElection(election) {
    const client = await pool.connect();
    try {
        let query = 'SELECT id, email, kyc_verified, age, country_of_residence FROM users WHERE 1=1';
        const params = [];

        if (election.kyc_required) {
            query += ` AND kyc_verified = true`;
        }

        if (election.age_restriction && election.age_restriction.length === 2) {
            const minAge = election.age_restriction[0];
            const maxAge = election.age_restriction[1];
            params.push(minAge, maxAge);
            query += ` AND age >= $${params.length - 1} AND age <= $${params.length}`;
        }

        if (election.regions && election.regions.length > 0) {
            params.push(election.regions);
            query += ` AND country_of_residence = ANY($${params.length})`;
        }

        const usersResult = await client.query(query, params);

        if (usersResult.rows.length === 0) {
            return;
        }

        const values = usersResult.rows.map(user => `(${election.id}, ${user.id}, '${user.email}')`).join(',');

        await client.query(
            `INSERT INTO eligible_voters (election_id, user_id, email) VALUES ${values} ON CONFLICT (election_id, user_id) DO NOTHING`
        );

    } catch (error) {
        console.error('Error in addEligibleUsersToElection query:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    addEligibleUsersToElection,
};
