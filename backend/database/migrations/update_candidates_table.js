const { pool } = require('../db');

async function updateCandidatesTable() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Remove the UNIQUE constraint on 'name'
        await client.query(`
            ALTER TABLE candidates
            DROP CONSTRAINT IF EXISTS candidates_name_key;
        `);

        // Add the composite UNIQUE constraint on 'election_id' and 'name'
        await client.query(`
            ALTER TABLE candidates
            ADD CONSTRAINT unique_election_candidate UNIQUE (election_id, name);
        `);

        await client.query('COMMIT');
        console.log('candidates table updated successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating candidates table:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    updateCandidatesTable
};
