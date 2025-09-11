const { createElection } = require('../../database/queries/elections/createElection.js');
const yup = require('yup');

const createElectionSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  // startDate and endDate are not required at the point of creation anymore
  // They will be set during the finalization step.
  organization: yup.string().optional(),
  isPublic: yup.boolean().required('Is public is required'),
  ownerAddress: yup.string().required('Owner address is required'),
  ownerUserId: yup.number().integer().positive().optional(),
});

const postElection = async (req, res) => {
  try {
    const electionData = req.body;

    await createElectionSchema.validate(electionData, { abortEarly: false });

    // Set initial status to REGISTRATION
    electionData.status = 'REGISTRATION';

    const newElection = await createElection(electionData);
    res.status(201).json({
      message: 'Election created successfully in registration phase.',
      election: newElection,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }

    if (error.name === 'DatabaseError') {
      return res.status(409).json({
        error: error.message,
        code: error.code,
      });
    }

    res.status(500).json({
      error: 'Failed to create election',
      details: error.message,
    });
  }
};

module.exports = {
  postElection,
};
