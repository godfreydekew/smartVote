const { pool } = require('../db');

async function updateElectionsTable() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Check if the 'type' column already exists
        const typeColumnCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='elections' AND column_name='type'
        `);

        if (typeColumnCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE elections
                ADD COLUMN type VARCHAR(255) NOT NULL DEFAULT 'public';
            `);
        }

        // Check if the 'kyc_required' column already exists
        const kycRequiredColumnCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='elections' AND column_name='kyc_required'
        `);

        if (kycRequiredColumnCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE elections
                ADD COLUMN kyc_required BOOLEAN NOT NULL DEFAULT FALSE;
            `);
        }

        // Check if the 'age_restriction' column already exists
        const ageRestrictionColumnCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='elections' AND column_name='age_restriction'
        `);

        if (ageRestrictionColumnCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE elections
                ADD COLUMN age_restriction INTEGER[];
            `);
        }

        // Check if the 'regions' column already exists
        const regionsColumnCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='elections' AND column_name='regions'
        `);

        if (regionsColumnCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE elections
                ADD COLUMN regions TEXT[];
            `);
        }

        // Check if the 'is_public' column exists before dropping it
        const isPublicColumnCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='elections' AND column_name='is_public'
        `);

        if (isPublicColumnCheck.rows.length > 0) {
            await client.query(`
                ALTER TABLE elections
                DROP COLUMN is_public;
            `);
        }

        await client.query('COMMIT');
        console.log('elections table updated successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating elections table:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function updateEligibleVotersTable() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Check if 'user_identifier' column exists before attempting to drop it
        const userIdentifierCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='eligible_voters' AND column_name='user_identifier'
        `);

        if (userIdentifierCheck.rows.length > 0) {
            await client.query(`
                ALTER TABLE eligible_voters
                DROP COLUMN user_identifier;
            `);
        }

        // Check if 'user_id' column exists
        const userIdCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='eligible_voters' AND column_name='user_id'
        `);

        if (userIdCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE eligible_voters
                ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
            `);
        }

        // Check if 'email' column exists
        const emailCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='eligible_voters' AND column_name='email'
        `);

        if (emailCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE eligible_voters
                ADD COLUMN email VARCHAR(255);
            `);
        }

        // Add unique constraint on election_id and email if it doesn't exist
        const uniqueEmailConstraintCheck = await client.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name='eligible_voters' AND constraint_name='unique_election_email'
        `);

        if (uniqueEmailConstraintCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE eligible_voters
                ADD CONSTRAINT unique_election_email UNIQUE (election_id, email);
            `);
        }

        // Add unique constraint on election_id and user_id if it doesn't exist
        const uniqueUserConstraintCheck = await client.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name='eligible_voters' AND constraint_name='unique_election_user'
        `);

        if (uniqueUserConstraintCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE eligible_voters
                ADD CONSTRAINT unique_election_user UNIQUE (election_id, user_id);
            `);
        }

        await client.query('COMMIT');
        console.log('eligible_voters table updated successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating eligible_voters table:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    updateElectionsTable,
    updateEligibleVotersTable
};