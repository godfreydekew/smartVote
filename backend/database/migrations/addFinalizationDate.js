const { pool } = require('../db');

async function addFinalizationDate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      ALTER TABLE elections 
      ADD COLUMN IF NOT EXISTS finalization_date TIMESTAMP NULL;
    `);

    await client.query('COMMIT');
    console.log('Successfully added finalization_date column to elections table.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding finalization_date column:', error);
    throw error;
  } finally {
    client.release();
  }
}

addFinalizationDate();

module.exports = {
    addFinalizationDate
};