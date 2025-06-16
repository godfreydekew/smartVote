const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function createCandidates(electionId, candidates) {
  try {
    const client = await pool.connect(); 
    try {
      await client.query('BEGIN');

      const insertedCandidates = [];
      for (const candidate of candidates) {
        const { name, party, position, bio, photo, twitter, website } = candidate;
        const result = await client.query(
          `
          INSERT INTO candidates (name, party, position, bio, photo, twitter, website, election_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, name, party, position, bio, photo, twitter, website, election_id
          `,
          [name, party, position, bio, photo, twitter, website, electionId]
        );
        insertedCandidates.push(result.rows[0]);
      }

      await client.query('COMMIT'); 
      return insertedCandidates;
    } catch (error) {
      await client.query('ROLLBACK'); 

      if (error.code === '23505' && error.constraint === 'candidates_name_key') {
        throw new DatabaseError(`Candidate name already exists`, 'DUPLICATE_CANDIDATE_NAME');
      }
      throw new DatabaseError('Error creating candidates: ' + error.message);
    } finally {
      client.release(); 
    }

  } catch (error) {
    throw error; 
  }
}

  
  module.exports = {
    createCandidates,
  };