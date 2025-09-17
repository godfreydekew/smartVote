const { isUserEligible } = require('../../database/queries/elections/isUserEligible.js');
const { DatabaseError } = require('../../database/utils/errors.js');

const isEligible = async (req, res) => {
    const { electionId } = req.params;
    const userId = req.session.user.id;

    try {
        const eligible = await isUserEligible(electionId, userId);
        res.status(200).json({ isEligible: eligible });
    } catch (error) {
        console.error('Error checking eligibility:', error);
        if (error instanceof DatabaseError) {
            return res.status(400).json({
                message: 'Invalid data input',
                error: error.message,
            });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    isEligible,
};
