const express = require('express');
const router = express.Router();
const authenticateSession = require('../middleware/authenticateSession.js');
const {
  getAllAuditLogs,
  getAuditLogsByElectionId,
} = require('../controllers/security/getAuditLogs.js');
const { getAllSecurityBreaches } = require('../controllers/security/getSecurityBreaches.js');
const { modifySecurityBreach } = require('../controllers/security/modifySecurityBreach.js');

router.get('/audit-logs', authenticateSession, getAllAuditLogs);
router.get('/audit-logs/:electionId', authenticateSession, getAuditLogsByElectionId);

router.get('/breaches', authenticateSession, getAllSecurityBreaches);
router.patch('/breaches/:breachId', authenticateSession, modifySecurityBreach);

module.exports = router;
