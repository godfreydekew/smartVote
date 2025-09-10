const {
    fetchGeneralOverview,
    fetchElectionAnalytics,
    fetchVotesOverTime
  } = require('../../database/queries/analytics/analyticsQueries');
  
  const getGeneralOverview = async (req, res) => {
    const ownerUserId = req.user.id; 
  
    try {
      const overview = await fetchGeneralOverview(ownerUserId);
  
      if (overview.average_duration_seconds) {
        overview.average_duration_days = Math.round(overview.average_duration_seconds / (24 * 60 * 60));
      }
      delete overview.average_duration_seconds;
  
      res.status(200).json(overview);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch general overview',
        details: error.message,
      });
    }
  };
  
  const getElectionAnalytics = async (req, res) => {
    const { electionId } = req.params;
  
    try {
      const analytics = await fetchElectionAnalytics(electionId);
      if (!analytics) {
        return res.status(404).json({ message: 'Analytics not found for this election' });
      }
  
      const votesOverTime = await fetchVotesOverTime(electionId);
  
      res.status(200).json({ analytics, votesOverTime });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch election analytics',
        details: error.message,
      });
    }
  };
  
  module.exports = {
    getGeneralOverview,
    getElectionAnalytics,
  };