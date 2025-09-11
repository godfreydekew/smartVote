const { createElection } = require('../../database/queries/elections/createElection.js');
const yup = require('yup');
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

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
  voters: yup.array().of(yup.object().shape({ publicKey: yup.string().required() })).optional(),
});

const postElection = async (req, res) => {
  try {
    const electionData = req.body;

    await createElectionSchema.validate(electionData, { abortEarly: false });

    if (electionData.voters) {
      const leaves = electionData.voters.map(voter => SHA256(voter.publicKey));
      const tree = new MerkleTree(leaves, SHA256);
      const root = tree.getRoot().toString('hex');
      electionData.merkleRoot = root;
    }

    const newElection = await createElection(electionData);
    res.status(201).json({
      message: 'Election created successfully',
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
