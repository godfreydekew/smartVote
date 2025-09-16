const { patchSecurityBreach } = require('../../database/queries/security/patchSecurityBreach');

const modifySecurityBreach = async (req, res) => {
  const { breachId } = req.params;
  const { resolutionStatus } = req.body;

  try {
    const updatedBreach = await patchSecurityBreach(breachId, resolutionStatus);
    if (!updatedBreach) {
      return res.status(404).json({ message: 'Security breach not found' });
    }

    res.status(200).json({ updatedBreach });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update security breach',
      details: error.message,
    });
  }
};
module.exports = {
  modifySecurityBreach,
};
