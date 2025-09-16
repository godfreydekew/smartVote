const statusMap = {
  0: 'upcoming',
  1: 'active',
  2: 'completed',
  3: 'cancelled',
};

const getStatusString = status => {
  return statusMap[status] || 'unknown';
};

module.exports = { getStatusString };
