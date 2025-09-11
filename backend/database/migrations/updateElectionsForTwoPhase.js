const { pool } = require('../db');

async function updateElectionsForTwoPhase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Add a CHECK constraint to the status column to act like an ENUM
    await client.query(`
      ALTER TABLE elections 
      ADD CONSTRAINT status_check CHECK (status IN ('REGISTRATION', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'));
    `);

    // Make the merkle_root column nullable
    await client.query(`
      ALTER TABLE elections 
      ALTER COLUMN merkle_root DROP NOT NULL;
    `);

    await client.query('COMMIT');
    console.log('Elections table successfully updated for two-phase voting.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating elections table:', error);
    // If the constraint already exists, this will fail. We can ignore that error.
    if (error.code !== '42710') { // 42710 is duplicate_object
        throw error;
    }
  } finally {
    client.release();
  }
}

updateElectionsForTwoPhase();

module.exports = {
    updateElectionsForTwoPhase
};