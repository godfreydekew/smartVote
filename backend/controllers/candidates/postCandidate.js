const { createCandidates } = require('../../database/queries/candidates/createCandidates');
const yup = require('yup');

// Define validation schema for a single candidate
const candidateSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  party: yup.string().optional(),
  position: yup.string().required('Position is required'),
  bio: yup.string().optional(),
  // photo: yup.string().url().optional(),
  twitter: yup.string().optional(),
  // website: yup.string().url().optional(),
});

// Schema for the array of candidates
const candidatesSchema = yup
  .array()
  .of(candidateSchema)
  .min(1, 'At least one candidate is required');

/**
 * Handles candidate submission for a given election.
 * Validates each candidate, then saves them to the database.
 */
const postCandidates = async (req, res) => {
  const { electionId } = req.params;
  const { candidates } = req.body;

  try {
    await candidatesSchema.validate(candidates, { abortEarly: true });
    const newCandidates = await createCandidates(parseInt(electionId), candidates);

    res.status(201).json({ 
      message: 'Candidates created successfully', 
      candidates: newCandidates 
    });
    
  } catch (error) {
    console.error('Error creating candidates:', error);

    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }

    if (error.name === 'DatabaseError') {
      return res.status(409).json({ error: error.message, code: error.code });
    }

    res.status(500).json({ 
      error: 'Failed to create candidates', 
      details: error.message 
    });
  }
};

module.exports = {
  postCandidates,
};
