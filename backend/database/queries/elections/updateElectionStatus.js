const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

/**
 * Updates the status of a specific election.
 * @param {number} electionId - The ID of the election to update.
 * @param {string} newStatus - The new status to set for the election.
 * @returns {Promise<object>} The updated election object.
 * @throws {DatabaseError} If the election is not found or the update fails.
 */
async function updateElectionStatus(electionId, newStatus) {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `UPDATE elections SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            [newStatus, electionId]
        );

        if (result.rows.length === 0) {
            throw new DatabaseError('Election not found or status could not be updated.', 404);
        }

        return result.rows[0];
    } catch (error) {
        console.error(`Error updating status for election ${electionId}:`, error);
        // Re-throw custom or original error to be handled by the controller
        if (error instanceof DatabaseError) {
            throw error;
        }
        throw new DatabaseError('Failed to update election status in the database.');
    } finally {
        client.release();
    }
}

module.exports = {
    updateElectionStatus,
};
