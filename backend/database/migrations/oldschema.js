const { pool } = require('../db');
//Fix the candidate Duplicate Issue
async function createTables() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        hashed_password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        ipfs_profile_hash TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN DEFAULT TRUE,
        role VARCHAR(50) DEFAULT 'user'
      );
    `);

    // Create user_documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_documents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        document_type TEXT NOT NULL,
        ipfs_profile_hash TEXT NOT NULL,
        is_verified VARCHAR(255),
        verified_at TIMESTAMP WITH TIME ZONE,
        verification_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create wallet table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        address VARCHAR(255) UNIQUE NOT NULL,
        chain_type VARCHAR(255),
        is_primary BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create organization table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organization (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        ipfs_details_hash TEXT UNIQUE,
        contact_info JSONB,
        is_verified BOOLEAN,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create election table
    await client.query(`
      CREATE TABLE IF NOT EXISTS election (
        id SERIAL PRIMARY KEY,
        organization_id INTEGER REFERENCES organization(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        ipfs_details_hash TEXT UNIQUE,
        smart_contract_address TEXT,
        start_time TIMESTAMP WITH TIME ZONE,
        end_time TIMESTAMP WITH TIME ZONE,
        status VARCHAR(255),
        parameters JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (organization_id, title)
      );
    `);

    // Create organization_admin table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organization_admin (
        id SERIAL PRIMARY KEY,
        organization_id INTEGER REFERENCES organization(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(255),
        permissions JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (user_id)
      );
    `);

    // Create election_rule table
    await client.query(`
      CREATE TABLE IF NOT EXISTS election_rule (
        id SERIAL PRIMARY KEY,
        election_id INTEGER REFERENCES election(id) ON DELETE CASCADE,
        rule_type VARCHAR(255),
        rule_parameters JSONB,
        is_active BOOLEAN,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create candidate table
    await client.query(`
          CREATE TABLE IF NOT EXISTS candidate (
            id SERIAL PRIMARY KEY,
            election_id INTEGER REFERENCES election(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            ipfs_details_hash TEXT NOT NULL,
            manifest_hash TEXT NOT NULL,
            ballot_position INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
    `);
    // Create vote_record table
    await client.query(`
      CREATE TABLE IF NOT EXISTS vote_record (
        id SERIAL PRIMARY KEY,
        election_id INTEGER REFERENCES election(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        candidate_id INTEGER REFERENCES candidate(id) ON DELETE CASCADE,
        transaction_hash VARCHAR(255) UNIQUE,
        zk_proof TEXT,
        vote_hash TEXT,
        voted_at TIMESTAMP WITH TIME ZONE,
        verification_status VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create eligible_voters table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eligible_voters (
        id SERIAL PRIMARY KEY,
        election_id INTEGER REFERENCES election(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        voter_status VARCHAR(50) DEFAULT 'pending',
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (election_id, email)
      );
    `);

    await client.query('COMMIT');
    console.log('Tables created successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

// createTables()
//   .then(() => {
//     console.log('All tables created successfully.');
//   })
//   .catch(error => {
//     console.error('Error creating tables:', error);
//     process.exit(0);
//   });

module.exports = {
  createTables
};