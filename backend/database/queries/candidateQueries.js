const { pool } = require("../db");
const { DatabaseError } = require('../utils/errors');

async function createCandidate(electionId, name, ipfsDetailsHash, manifestHash, ballotPosition) {
  try {
    const result = await pool.query(
      `INSERT INTO candidate (
        election_id, name, ipfs_details_hash, manifest_hash, ballot_position
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [electionId, name, ipfsDetailsHash, manifestHash, ballotPosition]
    );
    
    if (!result.rows[0]) {
      throw new DatabaseError('Failed to create candidate');
    }
    
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      throw new DatabaseError('Ballot position already taken');
    }
    throw new DatabaseError('Error creating candidate: ' + error.message);
  }
}

async function getCandidateById(candidateId) {
  try {
    const result = await pool.query(
      `SELECT c.*, e.title as election_title 
       FROM candidate c
       JOIN election e ON e.id = c.election_id
       WHERE c.id = $1`,
      [candidateId]
    );
    
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Error fetching candidate: ' + error.message);
  }
}

async function getElectionCandidates(electionId) {
  try {
    const result = await pool.query(
      "SELECT * FROM candidate WHERE election_id = $1 ORDER BY ballot_position ASC",
      [electionId]
    );
    
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Error fetching election candidates: ' + error.message);
  }
}

async function updateCandidate(candidateId, name, ipfsDetailsHash, manifestHash, ballotPosition) {
  try {
    const result = await pool.query(
      `UPDATE candidate 
       SET name = $2, ipfs_details_hash = $3, manifest_hash = $4, 
           ballot_position = $5, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [candidateId, name, ipfsDetailsHash, manifestHash, ballotPosition]
    );
    
    if (!result.rows[0]) {
      throw new DatabaseError('Candidate not found');
    }
    
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new DatabaseError('Ballot position already taken');
    }
    throw new DatabaseError('Error updating candidate: ' + error.message);
  }
}

async function deleteCandidate(candidateId) {
  try {
    const result = await pool.query(
      "DELETE FROM candidate WHERE id = $1 RETURNING *",
      [candidateId]
    );
    
    if (!result.rows[0]) {
      throw new DatabaseError('Candidate not found');
    }
    
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Error deleting candidate: ' + error.message);
  }
}

module.exports = {
  createCandidate,
  getCandidateById,
  getElectionCandidates,
  updateCandidate,
  deleteCandidate,
};