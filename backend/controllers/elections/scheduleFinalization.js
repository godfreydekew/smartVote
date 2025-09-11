const { pool } = require('../../database/db');
const { fetchElectionById } = require('../../database/queries/elections/fetchElection');

const scheduleFinalization = async (req, res) => {
  const { electionId } = req.params;
  const { finalizationDate } = req.body;

  if (!finalizationDate) {
    return res.status(400).json({ error: 'Finalization date is required.' });
  }

  const scheduleTime = new Date(finalizationDate);
  if (isNaN(scheduleTime.getTime()) || scheduleTime <= new Date()) {
      return res.status(400).json({ error: 'Please provide a valid future date for finalization.' });
  }

  try {
    const election = await fetchElectionById(electionId);

    if (!election) {
      return res.status(404).json({ error: 'Election not found.' });
    }

    if (election.status !== 'REGISTRATION') {
      return res.status(403).json({ error: 'This election is not in the registration phase.' });
    }

    await pool.query(
      'UPDATE elections SET finalization_date = $1 WHERE id = $2',
      [scheduleTime, electionId]
    );

    res.status(200).json({ message: `Election finalization scheduled for ${scheduleTime.toISOString()}` });

  } catch (error) {
    console.error('Error scheduling election finalization:', error);
    res.status(500).json({ error: 'Failed to schedule election finalization.', details: error.message });
  }
};

module.exports = { scheduleFinalization };
