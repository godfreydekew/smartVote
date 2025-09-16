const {
  fetchAllAuditLogs,
  fetchAuditLogsByElectionId,
} = require('../../database/queries/security/fetchAuditLogs');

// Fetch all audit logs
const getAllAuditLogs = async (req, res) => {
  try {
    const auditLogs = await fetchAllAuditLogs();
    res.status(200).json({ auditLogs });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch audit logs',
      details: error.message,
    });
  }
};

const getAuditLogsByElectionId = async (req, res) => {
  const { electionId } = req.params;

  try {
    const auditLogs = await fetchAuditLogsByElectionId(electionId);
    if (!auditLogs || auditLogs.length === 0) {
      return res.status(404).json({ message: 'No audit logs found for the given election ID' });
    }

    res.status(200).json({ auditLogs });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch audit logs by election ID',
      details: error.message,
    });
  }
};

module.exports = {
  getAllAuditLogs,
  getAuditLogsByElectionId,
};
