const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authentication.js'); // Or your session auth
const { 
    getGeneralOverview, 
    getElectionAnalytics 
} = require('../controllers/analytics/analyticsController');

router.get('/overview', authenticateToken, getGeneralOverview);
router.get('/election/:electionId', authenticateToken, getElectionAnalytics);

module.exports = router;