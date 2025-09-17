const { pool } = require('../db');

async function dropTables() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query('DROP TABLE IF EXISTS vote_logs CASCADE;');
    await client.query('DROP TABLE IF EXISTS election_analytics CASCADE;');
    await client.query('DROP TABLE IF EXISTS notifications CASCADE;');
    await client.query('DROP TABLE IF EXISTS forget_password CASCADE;');
    await client.query('DROP TABLE IF EXISTS eligible_voters CASCADE;');
    await client.query('DROP TABLE IF EXISTS user_participated_elections CASCADE;');
    await client.query('DROP TABLE IF EXISTS user_created_elections CASCADE;');
    await client.query('DROP TABLE IF EXISTS election_candidates CASCADE;');
    await client.query('DROP TABLE IF EXISTS candidates CASCADE;');
    await client.query('DROP TABLE IF EXISTS elections CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');

    await client.query('COMMIT');
    console.log('Tables dropped successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error dropping tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

// dropTables()

module.exports = {
  dropTables
};