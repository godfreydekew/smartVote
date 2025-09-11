const express = require('express');
const router = express.Router();
const authenticateSession = require('../middleware/authenticateSession.js');
const authorizeAdmin = require('../middleware/authorizeAdmin.js');

const { postElection } = require('../controllers/elections/postElection.js');
const { getCandidatesByElectionId } = require('../controllers/elections/getElectionCandidates.js');
const { postCandidates } = require('../controllers/candidates/postCandidate.js');
const { getElections } = require('../controllers/elections/getElection.js');
const { getElectionsByStatus } = require('../controllers/elections/getElection.js');
const { getElection } = require('../controllers/elections/getElection.js');
const { deleteElection } = require('../controllers/elections/deleteElection.js');
const { postVote } = require('../controllers/elections/postVote.js');
const { hasVoted } = require('../controllers/elections/postVote.js');
const { getMerkleProof } = require('../controllers/elections/getMerkleProof.js');
const { registerVoter } = require('../controllers/elections/registerVoter.js');
const { scheduleFinalization } = require('../controllers/elections/scheduleFinalization.js');
const { finalizeElectionNow } = require('../controllers/elections/finalizeElectionNow.js');

router.post('/election', authenticateSession, authorizeAdmin, postElection);
router.get('/elections', authenticateSession, getElections);
router.get('/election/:electionId', authenticateSession, getElection);
router.get('/elections/status/:status', authenticateSession, getElectionsByStatus);
router.delete('/election/:electionId', authenticateSession, authorizeAdmin, deleteElection);

router.post('/election/register/:electionId', authenticateSession, registerVoter);
router.post('/election/schedule-finalization/:electionId', authenticateSession, authorizeAdmin, scheduleFinalization);
router.post('/election/finalize-now/:electionId', authenticateSession, authorizeAdmin, finalizeElectionNow);

router.put('/election/vote/:electionId', authenticateSession, postVote);
router.get('/election/has-voted/:electionId', authenticateSession, hasVoted);
router.get('/election/merkle-proof/:electionId/:publicKey', authenticateSession, getMerkleProof);


router.post('/candidate/:electionId', authenticateSession, authorizeAdmin, postCandidates);
router.get('/candidates/:electionId', authenticateSession, getCandidatesByElectionId);

module.exports = router;
