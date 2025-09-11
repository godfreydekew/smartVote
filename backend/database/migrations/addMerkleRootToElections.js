const { pool } = require('../db');

async function addMerkleRootToElections() {
  try {
    await pool.query('ALTER TABLE elections ADD COLUMN merkle_root VARCHAR(255)');
    console.log('Successfully added merkle_root column to elections table');
  } catch (error) {
    console.error('Error adding merkle_root column to elections table:', error);
  }
}

addMerkleRootToElections();
