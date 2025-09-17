export const electionDetails = {
  loading: {
    title: 'Loading Election Details...',
    description: 'Please wait while we fetch the election data.',
  },
  notFound: {
    title: 'Election Not Found',
    description: "The election you're looking for doesn't exist or has been removed.",
    returnToDashboard: 'Return to Dashboard',
  },
  header: {
    backToDashboard: 'Back to dashboard',
    back: 'Back',
    status: {
      active: 'Active',
      upcoming: 'Upcoming',
      completed: 'Completed',
    },
  },
  stats: {
    startDate: 'Start Date',
    endDate: 'End Date',
    participants: 'Participants',
    totalVotes: 'Total Votes',
    timeRemaining: 'Time Remaining',
    endingToday: 'Ending today',
    daysRemaining: 'days remaining',
    dayRemaining: 'day remaining',
  },
  rules: {
    title: 'Election Rules',
    noRules: 'No specific rules defined for this election.',
  },
  candidates: {
    title: 'Candidates',
    count: 'candidates',
    vote: 'Vote',
    viewProfile: 'View Profile',
    votes: 'votes',
    voteCount: 'Vote Count',
    percentage: 'Percentage',
  },
  voting: {
    confirmVote: 'Confirm Vote',
    voteFor: 'Vote for',
    confirmVoteDescription: 'Are you sure you want to vote for this candidate? This action cannot be undone.',
    voteSuccessful: 'Vote Successful',
    voteSuccessfulDescription: 'You have successfully voted for',
    alreadyVoted: 'You have already voted in this election.',
    votingError: 'Voting Error',
    votingErrorDescription: 'There was an error processing your vote. Please try again.',
    securityAlert: 'Warning Alert',
    securityAlertDescription:
      'You have already voted in this election. If you think there was a mistake Please contact support.',
  },
  blockchain: {
    title: 'Blockchain Logs',
    subtitle: 'View blockchain transaction logs for this election',
    contractAddress: 'Contract Address',
    network: 'Network',
    transactionHash: 'Transaction Hash',
    blockNumber: 'Block Number',
    gasUsed: 'Gas Used',
    status: 'Status',
  },
  mobile: {
    viewCandidatesAndVote: 'View candidates and vote',
  },
};
