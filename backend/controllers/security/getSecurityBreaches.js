const {
  fetchAllSecurityBreaches,
} = require('../../database/queries/security/fetchSecurityBreaches.js');

// Fetch all security breaches
const getAllSecurityBreaches = async (req, res) => {
  try {
    const securityBreaches = await fetchAllSecurityBreaches();
    res.status(200).json({ securityBreaches });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch security breaches',
      details: error.message,
    });
  }
};

module.exports = {
  getAllSecurityBreaches,
};
