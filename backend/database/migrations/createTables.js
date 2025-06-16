const { pool } = require('../db');

async function createTables() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            full_name TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            country_of_residence TEXT,
            email TEXT UNIQUE NOT NULL,
            password TEXT,
            user_role TEXT DEFAULT 'basic', -- 'admin', 'basic'
            kyc_verified BOOLEAN DEFAULT FALSE,
            kyc_session_id VARCHAR(255) DEFAULT NULL, -- For storing KYC session ID
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP,
            UNIQUE (email, full_name, id)
        );
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS elections (
            id SERIAL PRIMARY KEY, -- Matches smart contract election.id
            title TEXT,
            description TEXT,
            start_date TIMESTAMP,
            end_date TIMESTAMP,
            status TEXT, -- 'upcoming', 'active', 'completed', 'cancelled'
            image_url TEXT,
            participants INT DEFAULT 0,
            total_votes INT DEFAULT 0,
            progress FLOAT DEFAULT 0,
            organization TEXT,
            is_public BOOLEAN,
            access_control TEXT, -- 'csv', 'manual', 'invite', 'public'
            age_restriction INTEGER[],
            regions TEXT[],
            use_captcha BOOLEAN DEFAULT FALSE,
            rules TEXT[],
            is_draft BOOLEAN DEFAULT FALSE,
            banner_image TEXT,
            primary_color TEXT,
            smart_contract_address TEXT UNIQUE,
            owner_address TEXT, -- Ethereum address of the election owner
            revoked BOOLEAN DEFAULT FALSE,
            revoked_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP,
            owner_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
        );
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS candidates (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            party TEXT,
            position TEXT NOT NULL,
            bio TEXT,
            photo TEXT,
            twitter TEXT,
            website TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP,
            election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE

        );
    `);


    await client.query(`
        CREATE TABLE IF NOT EXISTS user_created_elections (
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, election_id)
        );
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS user_participated_elections (
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
            has_voted BOOLEAN DEFAULT FALSE,
            vote_time TIMESTAMP,
            PRIMARY KEY (user_id, election_id)
        );
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS eligible_voters (
            id SERIAL PRIMARY KEY,
            election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
            user_identifier TEXT NOT NULL, -- Could be email, wallet address, invite code, etc.
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (election_id, user_identifier)
        );
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS forget_password (
            id SERIAL PRIMARY KEY,
            user_email TEXT NOT NULL,
            reset_token TEXT UNIQUE NOT NULL,
            expiry_date TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        );
    `);

    await client.query('COMMIT');
    console.log('All tables created successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

createTables()

module.exports = {
  createTables
};