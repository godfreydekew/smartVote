const { createElection } = require('../../database/queries/elections/createElection.js');
const { addInvitedEmailsToEligibleVoters } = require('../../database/queries/elections/addInvitedEmailsToEligibleVoters.js');
const yup = require('yup');

const createElectionSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date must be after start date'),
  status: yup.string().oneOf(['upcoming', 'active', 'completed', 'cancelled']).optional(),
  imageURL: yup.string().url().optional(),
  organization: yup.string().optional(),
  type: yup.string().oneOf(['public', 'private', 'invite-only']).required('Election type is required'),
  kyc_required: yup.boolean().optional(),
  age_restriction: yup.array().of(yup.number().integer().positive()).optional(),
  regions: yup.array().of(yup.string()).optional(),
  accessControl: yup
    .string()
    .oneOf(['csv', 'manual', 'invite', 'public'])
    .required('Access control is required'),
  ownerAddress: yup.string().required('Owner address is required'),
  ownerUserId: yup.number().integer().positive().optional(),
  invitedEmails: yup.array().of(yup.string().email('Invalid email format')).when('type', {
    is: 'invite-only',
    then: (schema) => schema.min(1, 'At least one invited email is required for invite-only elections'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const postElection = async (req, res) => {
  try {
    const electionData = req.body;

    await createElectionSchema.validate(electionData, { abortEarly: false });

    const newElection = await createElection(electionData);

    if (electionData.type === 'invite-only' && electionData.invitedEmails && newElection && newElection.id) {
      await addInvitedEmailsToEligibleVoters(newElection.id, electionData.invitedEmails);
    }

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
