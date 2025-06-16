const { createElection } = require('../../database/queries/elections/createElection.js');
const yup = require('yup');

// Validation schema for election creation
const createElectionSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  // startDate: yup.date().required('Start date is required'),
  // endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date must be after start date'),
  status: yup.string().oneOf(['upcoming', 'active', 'completed', 'cancelled']).optional(),
  imageURL: yup.string().url().optional(),
  organization: yup.string().optional(),
  isPublic: yup.boolean().required('Is public is required'),
  accessControl: yup
    .string()
    .oneOf(['csv', 'manual', 'invite', 'public'])
    .required('Access control is required'),
  ownerAddress: yup.string().required('Owner address is required'),
  ownerUserId: yup.number().integer().positive().optional(),
});

// Controller to handle POST /election
const postElection = async (req, res) => {
  try {
    const electionData = req.body;

    // Validate request body
    await createElectionSchema.validate(electionData, { abortEarly: false });

    // Insert election into the database
    const newElection = await createElection(electionData);
    res.status(201).json({ 
      message: 'Election created successfully', 
      election: newElection 
    });
  } catch (error) {
    // Validation error
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    
    // Database-specific error handling
    if (error.name === 'DatabaseError') {
      return res.status(409).json({ 
        error: error.message, 
        code: error.code 
      });
    }

    //General Internal server error
    res.status(500).json({ 
      error: 'Failed to create election', 
      details: error.message 
    });
  }
};

module.exports = {
  postElection,
};
