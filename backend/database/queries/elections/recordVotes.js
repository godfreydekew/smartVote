const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');
const { handlePostgresError } = require('../../utils/errors');

async function recordVote(electionId, userId) {
  //Increae the vote count for the election
  try {
    const userElectionResult = await pool.query(
      `INSERT into  user_participated_elections
             (user_id, election_id, has_voted, vote_time)
             VALUES ($1, $2, true, NOW())`,
      [userId, electionId]
    );

    const result = await pool.query(
      `UPDATE elections 
             SET total_votes = total_votes + 1 
             WHERE id = $1 RETURNING *`,
      [electionId]
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new DatabaseError('User has already voted in this election', 'USER_ALREADY_VOTED');
    }
    handlePostgresError(error);
  }
}

const checkHasVoted = async (electionId, userId) => {
  try {
    console.log('Checking if user has voted:in database', { electionId, userId });
    const result = await pool.query(
      `SELECT has_voted 
             FROM user_participated_elections 
             WHERE election_id = $1 AND user_id = $2`,
      [electionId, userId]
    );
    console.log('Result of checkHasVoted:', result.rows);

    if (result.rows.length === 0) {
      return false;
    }

    return result.rows[0].has_voted;
  } catch (error) {
    throw new DatabaseError('Error checking vote status: ' + error.message);
  }
};

module.exports = {
  recordVote,
  checkHasVoted,
};
