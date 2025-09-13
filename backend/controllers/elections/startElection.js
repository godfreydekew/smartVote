const { updateElectionStatus } = require('../../database/queries/elections/updateElectionStatus');
const { getElection } = require('../../database/queries/elections/fetchElection');

/**
 * Manually starts an election by changing its status from 'upcoming' to 'active'.
 */
const startElection = async (req, res) => {
    const { electionId } = req.params;

    try {
        // 1. Fetch the election to ensure it exists and is in the correct state
        const election = await getElection(electionId);

        if (!election) {
            return res.status(404).json({ error: 'Election not found.' });
        }

        if (election.status !== 'upcoming') {
            return res.status(400).json({ 
                error: `Election cannot be started. Its current status is '${election.status}'.`,
                status: election.status
            });
        }

        // 2. Update the status to 'active'
        const updatedElection = await updateElectionStatus(electionId, 'active');

        // TODO: Add logic to notify eligible voters about the election start
        // TODO: deploy smart contract of the election

        res.status(200).json({
            message: 'Election started successfully.',
            election: updatedElection,
        });

    } catch (error) {
        console.error(`Error starting election ${electionId}:`, error);
        res.status(500).json({
            error: 'Failed to start election.',
            details: error.message,
        });
    }
};

module.exports = {
    startElection,
};
