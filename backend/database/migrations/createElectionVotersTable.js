const { pool } = require('../db');

async function createElectionVotersTable() {
  try {
    await pool.query(`
      CREATE TABLE election_voters (
        id SERIAL PRIMARY KEY,
        election_id INTEGER REFERENCES elections(id),
        public_key VARCHAR(255) NOT NULL
      )
    `);
    console.log('Successfully created election_voters table');
  } catch (error) {
    console.error('Error creating election_voters table:', error);
  }
}

createElectionVotersTable();
