const express = require('express');
const router = express.Router();
const authenticateSession = require('../middleware/authenticateSession.js');
const { postElection } = require('../controllers/elections/postElection.js');
const { getCandidatesByElectionId } = require('../controllers/elections/getElectionCandidates.js');
const { postCandidates } = require('../controllers/candidates/postCandidate.js');
const { getElections } = require('../controllers/elections/getElection.js');
const { getElectionsByStatus } = require('../controllers/elections/getElection.js');
const { getElection } = require('../controllers/elections/getElection.js');
const { deleteElection } = require('../controllers/elections/deleteElection.js');
const { postVote } = require('../controllers/elections/postVote.js');
const { hasVoted } = require('../controllers/elections/postVote.js');
const { startElection } = require('../controllers/elections/startElection.js');

router.post('/election', authenticateSession, postElection);
router.get('/elections', authenticateSession, getElections);
router.get('/election/:electionId', authenticateSession, getElection);
router.get('/elections/status/:status', authenticateSession, getElectionsByStatus);
router.delete('/election/:electionId', authenticateSession, deleteElection);

router.put('/election/vote/:electionId', authenticateSession, postVote);
router.get('/election/has-voted/:electionId', authenticateSession, hasVoted);

router.put('/election/:electionId/start', authenticateSession, startElection);

router.post('/candidate/:electionId', postCandidates, authenticateSession);
router.get('/candidates/:electionId', authenticateSession, getCandidatesByElectionId);

module.exports = router;
