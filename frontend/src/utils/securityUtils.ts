/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

/**
 * Get relative time (e.g., "2h ago")
 */
export const getTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

/**
 * Calculate security statistics from raw data
 */
export const calculateSecurityStats = (audits, breaches) => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return {
    totalAudits: audits.length,
    activeBreaches: breaches.filter((b) => !b.resolved).length,
    resolvedBreaches: breaches.filter((b) => b.resolved).length,
    lastAuditTime: audits.length > 0 ? audits[0]?.check_time : null,
    recentAudits: audits.filter((a) => new Date(a.check_time) > last24h).length,
    criticalBreaches: breaches.filter((b) => !b.resolved && b.issue_type?.includes('vote_mismatch')).length,
  };
};

/**
 * Get severity level for breach types
 */
export const getSeverityLevel = (issueType) => {
  if (issueType?.includes('vote_mismatch')) return 'critical';
  if (issueType?.includes('status_mismatch')) return 'high';
  if (issueType?.includes('candidate_mismatch')) return 'medium';
  return 'low';
};

/**
 * Calculate system health percentage
 */
export const calculateSystemHealth = (activeBreaches) => {
  return Math.max(0, 100 - activeBreaches * 20);
};

/**
 * Filter audit logs based on criteria
 */
export const filterAuditLogs = (logs, { searchTerm = '', selectedElection = '' }) => {
  return logs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      log.election_id?.toString().includes(searchTerm) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesElection = selectedElection === '' || log.election_id?.toString() === selectedElection;

    return matchesSearch && matchesElection;
  });
};

/**
 * Filter breaches based on criteria
 */
export const filterBreaches = (breaches, { statusFilter = 'all', searchTerm = '' }) => {
  return breaches.filter((breach) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !breach.resolved) ||
      (statusFilter === 'resolved' && breach.resolved);

    const matchesSearch =
      searchTerm === '' ||
      breach.election_id?.toString().includes(searchTerm) ||
      breach.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });
};
