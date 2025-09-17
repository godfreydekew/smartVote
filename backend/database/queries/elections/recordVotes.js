const { pool } = require('../../db');
const { DatabaseError, handlePostgresError } = require('../../utils/errors');

async function recordVote(electionId, userId, candidateId) {
    const client = await pool.connect(); 
    try {
        await client.query('BEGIN');

        await client.query(
            `INSERT INTO user_participated_elections (user_id, election_id, has_voted, vote_time)
             VALUES ($1, $2, true, NOW())`,
            [userId, electionId]
        );

        await client.query(
            `INSERT INTO vote_log (time, election_id, candidate_id)
             VALUES (date_trunc('minute', NOW()), $1, $2)`,
            [electionId, candidateId]
        );

        const result = await client.query(
            `UPDATE elections
             SET total_votes = total_votes + 1
             WHERE id = $1
             RETURNING *`,
            [electionId]
        );

        await client.query('COMMIT');
        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '23505') {
            throw new DatabaseError('User has already voted in this election', 'USER_ALREADY_VOTED');
        }
        handlePostgresError(error);
    } finally {
        client.release(); 
    }
}

async function checkHasVoted(electionId, userId) {
    try {
        const result = await pool.query(
            'SELECT has_voted FROM user_participated_elections WHERE user_id = $1 AND election_id = $2',
            [userId, electionId]
        );
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error in checkHasVoted query:', error);
        handlePostgresError(error);
    }
}

module.exports = {
    recordVote,
    checkHasVoted,
};
