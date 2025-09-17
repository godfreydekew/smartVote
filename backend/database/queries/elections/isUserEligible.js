const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

/**
 * Checks if a user is in the eligible_voters table for a specific election.
 * @param {number} electionId - The ID of the election.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<boolean>} - True if the user is eligible, false otherwise.
 */
async function isUserEligible(electionId, userId) {
  try {
    const result = await pool.query(
      `
      SELECT (
        EXISTS(
          SELECT 1
          FROM eligible_voters
          WHERE election_id = $1 AND user_id = $2
        )
        OR
        EXISTS(
          SELECT 1
          FROM elections
          WHERE
            id = $1 AND
            type = 'public' AND
            kyc_required = FALSE AND
            age_restriction IS NULL AND
            regions IS NULL
        )
      ) AS is_eligible
      `,
      [electionId, userId]
    );
    return result.rows[0].is_eligible;
  } catch (error) {
    throw new DatabaseError(
      'Error checking user eligibility: ' + error.message
    );
  }
}

module.exports = {
  isUserEligible,
};
