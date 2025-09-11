const { pool } = require('../db');

async function updateElectionsForRegistration() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Add the merkle_root column if it doesn't exist
    await client.query(`
      ALTER TABLE elections 
      ADD COLUMN IF NOT EXISTS merkle_root VARCHAR(255) NULL;
    `);

    // Add a CHECK constraint to the status column to act like an ENUM
    // First, remove any old constraint to avoid conflicts
    await client.query(`ALTER TABLE elections DROP CONSTRAINT IF EXISTS status_check;`);
    await client.query(`
      ALTER TABLE elections 
      ADD CONSTRAINT status_check CHECK (status IN ('REGISTRATION', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'));
    `);

    await client.query('COMMIT');
    console.log('Elections table successfully updated for registration phase.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating elections table for registration:', error);
    throw error;
  } finally {
    client.release();
  }
}

updateElectionsForRegistration();

module.exports = {
    updateElectionsForRegistration
};