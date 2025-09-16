const { readContract } = require('thirdweb');
const { pool } = require('../database/db');
const { getStatusString } = require('../constants/statusMap');

/**
 * Security check result structure
 */
class SecurityCheckResult {
  constructor(passed, type, message, details = {}) {
    this.passed = passed;
    this.type = type;
    this.message = message;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Check if vote counts match between DB and blockchain
 */
async function checkVoteCountIntegrity(contract, election) {
  try {
    const electionStats = await readContract({
      contract,
      method: 'function getElectionStats() view returns (uint256, uint256)',
      params: [],
    });

    const chainTotalVotes = Number(electionStats[0]);
    const dbTotalVotes = election.total_votes || 0;

    const passed = chainTotalVotes === dbTotalVotes;
    const discrepancy = Math.abs(chainTotalVotes - dbTotalVotes);

    return new SecurityCheckResult(
      passed,
      'vote_count_integrity',
      passed
        ? 'Vote counts match'
        : `Vote count mismatch: DB=${dbTotalVotes}, Chain=${chainTotalVotes}`,
      {
        dbVotes: dbTotalVotes,
        chainVotes: chainTotalVotes,
        discrepancy,
      }
    );
  } catch (error) {
    return new SecurityCheckResult(
      false,
      'vote_count_integrity',
      `Failed to check vote counts: ${error.message}`,
      { error: error.message }
    );
  }
}

/**
 * Check if candidate counts and data match
 */
async function checkCandidateIntegrity(contract, election) {
  try {
    const chainCandidates = await readContract({
      contract,
      method:
        'function getCandidates() view returns ((uint256 id, string name, uint256 voteCount)[])',
      params: [],
    });

    const dbCandidatesResult = await pool.query(
      'SELECT id, name FROM candidates WHERE election_id = $1 ORDER BY name',
      [election.id]
    );

    console.log('Chain Candidates:', dbCandidatesResult);

    const chainCandidateCount = chainCandidates.length;
    const dbCandidateCount = dbCandidatesResult.rows.length;

    // Check count first
    if (chainCandidateCount !== dbCandidateCount) {
      return new SecurityCheckResult(
        false,
        'candidate_count_mismatch',
        `Candidate count mismatch: DB=${dbCandidateCount}, Chain=${chainCandidateCount}`,
        {
          dbCount: dbCandidateCount,
          chainCount: chainCandidateCount,
          chainCandidates: chainCandidates.map(c => ({ name: c.name, votes: Number(c.voteCount) })),
          dbCandidates: dbCandidatesResult.rows,
        }
      );
    }

    // Check individual candidates
    const mismatches = [];
    for (const chainCandidate of chainCandidates) {
      const dbCandidate = dbCandidatesResult.rows.find(db => db.name === chainCandidate.name);

      if (!dbCandidate) {
        mismatches.push({
          type: 'missing_in_db',
          candidateName: chainCandidate.name,
          chainVotes: Number(chainCandidate.voteCount),
        });
      }
    }

    for (const dbCandidate of dbCandidatesResult.rows) {
      const chainCandidate = chainCandidates.find(chain => chain.name === dbCandidate.name);

      if (!chainCandidate) {
        mismatches.push({
          type: 'missing_in_chain',
          candidateName: dbCandidate.name,
          dbId: dbCandidate.id,
        });
      }
    }

    const passed = mismatches.length === 0;

    return new SecurityCheckResult(
      passed,
      'candidate_integrity',
      passed ? 'All candidates match' : `${mismatches.length} candidate mismatches found`,
      { mismatches }
    );
  } catch (error) {
    return new SecurityCheckResult(
      false,
      'candidate_integrity',
      `Failed to check candidate integrity: ${error.message}`,
      { error: error.message }
    );
  }
}

/**
 * Check if election status matches
 */
async function checkElectionStatus(contract, election) {
  try {
    const chainStatus = await readContract({
      contract,
      method: 'function getElectionState() view returns (uint8)',
      params: [],
    });

    const chainStatusString = getStatusString(Number(chainStatus));
    const dbStatus = election.status;

    const passed = chainStatusString === dbStatus;

    return new SecurityCheckResult(
      passed,
      'status_mismatch',
      passed
        ? 'Election status matches'
        : `Status mismatch: DB="${dbStatus}", Chain="${chainStatusString}"`,
      {
        dbStatus,
        chainStatus: chainStatusString,
        chainStatusRaw: Number(chainStatus),
      }
    );
  } catch (error) {
    return new SecurityCheckResult(
      false,
      'status_check',
      `Failed to check election status: ${error.message}`,
      { error: error.message }
    );
  }
}

/**
 * Check if election timing matches (start/end times)
 */
async function checkElectionTiming(contract, election) {
  try {
    const electionDetails = await readContract({
      contract,
      method:
        'function getElectionDetails() view returns (uint256, string, uint256, uint256, uint8, bool, uint256)',
      params: [],
    });

    const chainStartTime = Number(electionDetails[2]);
    const chainEndTime = Number(electionDetails[3]);

    const dbStartTime = Math.floor(new Date(election.start_date).getTime() / 1000);
    const dbEndTime = Math.floor(new Date(election.end_date).getTime() / 1000);

    const startTimeMatch = chainStartTime === dbStartTime;
    const endTimeMatch = chainEndTime === dbEndTime;
    const passed = startTimeMatch && endTimeMatch;

    return new SecurityCheckResult(
      passed,
      'timing_mismatch',
      passed ? 'Election timing matches' : `Timing mismatch detected`,
      {
        startTime: {
          db: dbStartTime,
          chain: chainStartTime,
          match: startTimeMatch,
          dbDate: election.start_date,
          chainDate: new Date(chainStartTime * 1000).toISOString(),
        },
        endTime: {
          db: dbEndTime,
          chain: chainEndTime,
          match: endTimeMatch,
          dbDate: election.end_date,
          chainDate: new Date(chainEndTime * 1000).toISOString(),
        },
      }
    );
  } catch (error) {
    return new SecurityCheckResult(
      false,
      'timing_check',
      `Failed to check election timing: ${error.message}`,
      { error: error.message }
    );
  }
}

/**
 * Check if election ownership matches
 */
async function checkElectionOwnership(contract, election) {
  try {
    const chainOwner = await readContract({
      contract,
      method: 'function getEelectionOwner() view returns (address)',
      params: [],
    });

    const dbOwner = election.owner_address;

    if (!dbOwner) {
      return new SecurityCheckResult(
        false,
        'ownership_check',
        'No owner address stored in database',
        { chainOwner }
      );
    }

    const passed = dbOwner.toLowerCase() === chainOwner.toLowerCase();

    return new SecurityCheckResult(
      passed,
      'ownership_mismatch',
      passed
        ? 'Election ownership matches'
        : `Ownership mismatch: DB="${dbOwner}", Chain="${chainOwner}"`,
      {
        dbOwner,
        chainOwner,
        normalized: {
          db: dbOwner.toLowerCase(),
          chain: chainOwner.toLowerCase(),
        },
      }
    );
  } catch (error) {
    return new SecurityCheckResult(
      false,
      'ownership_check',
      `Failed to check ownership: ${error.message}`,
      { error: error.message }
    );
  }
}

/**
 * Check for time-based status consistency
 */
async function checkTimeBasedStatus(contract, election) {
  try {
    const electionDetails = await readContract({
      contract,
      method:
        'function getElectionDetails() view returns (uint256, string, uint256, uint256, uint8, bool, uint256)',
      params: [],
    });

    const chainStartTime = Number(electionDetails[2]);
    const chainEndTime = Number(electionDetails[3]);
    const chainStatus = Number(electionDetails[4]);

    const currentTime = Math.floor(Date.now() / 1000);

    let expectedStatus;
    if (currentTime < chainStartTime) {
      expectedStatus = 0; // UPCOMING
    } else if (currentTime < chainEndTime) {
      expectedStatus = 1; // ACTIVE
    } else {
      expectedStatus = 2; // COMPLETED
    }

    // Don't flag if manually cancelled
    const passed = chainStatus === expectedStatus || chainStatus === 3; // 3 = CANCELLED

    return new SecurityCheckResult(
      passed,
      'time_status_inconsistency',
      passed
        ? 'Status consistent with time'
        : `Status should be ${expectedStatus} but is ${chainStatus}`,
      {
        currentTime,
        chainStartTime,
        chainEndTime,
        chainStatus,
        expectedStatus,
        timestamps: {
          current: new Date(currentTime * 1000).toISOString(),
          start: new Date(chainStartTime * 1000).toISOString(),
          end: new Date(chainEndTime * 1000).toISOString(),
        },
      }
    );
  } catch (error) {
    return new SecurityCheckResult(
      false,
      'time_status_check',
      `Failed to check time-based status: ${error.message}`,
      { error: error.message }
    );
  }
}

/**
 * Check individual candidate vote counts
 */
async function checkIndividualCandidateVotes(contract, election) {
  try {
    const chainCandidates = await readContract({
      contract,
      method:
        'function getCandidates() view returns ((uint256 id, string name, uint256 voteCount)[])',
      params: [],
    });

    const voteDiscrepancies = [];

    for (const chainCandidate of chainCandidates) {
      // In your DB, you don't seem to store individual candidate vote counts
      // This is actually a security gap! You should add a vote_count column to candidates table

      // For now, we'll check if candidate exists and log the chain vote count
      console.log(chainCandidate);
      const dbCandidate = await pool.query(
        'SELECT id, name FROM candidates WHERE election_id = $1 AND name = $2',
        [election.id, chainCandidate.name]
      );

      if (dbCandidate.rows.length === 0) {
        voteDiscrepancies.push({
          candidateName: chainCandidate.name,
          issue: 'candidate_missing_in_db',
          chainVotes: Number(chainCandidate.voteCount),
        });
      } else {
        // TODO: Once you add vote_count column to candidates table,
        // MIGRATION: ALTER TABLE candidates ADD COLUMN vote_count INTEGER DEFAULT 0;
        // uncomment this to check individual vote counts
        /*
        const dbVoteCount = dbCandidate.rows[0].vote_count || 0;
        const chainVoteCount = Number(chainCandidate.voteCount);
        
        if (dbVoteCount !== chainVoteCount) {
          voteDiscrepancies.push({
            candidateName: chainCandidate.name,
            issue: 'vote_count_mismatch',
            dbVotes: dbVoteCount,
            chainVotes: chainVoteCount,
            discrepancy: Math.abs(dbVoteCount - chainVoteCount)
          });
        }
        */
      }
    }

    const passed = voteDiscrepancies.length === 0;

    return new SecurityCheckResult(
      passed,
      'individual_candidate_votes',
      passed
        ? 'Individual candidate votes consistent'
        : `${voteDiscrepancies.length} candidate vote discrepancies`,
      {
        discrepancies: voteDiscrepancies,
        note: 'Add vote_count column to candidates table for full vote integrity checking',
      }
    );
  } catch (error) {
    return new SecurityCheckResult(
      false,
      'individual_candidate_votes',
      `Failed to check individual candidate votes: ${error.message}`,
      { error: error.message }
    );
  }
}

/**
 * Run all security checks for an election
 */
async function runAllSecurityChecks(contract, election) {
  const checks = [
    checkVoteCountIntegrity,
    checkCandidateIntegrity,
    checkElectionStatus,
    checkElectionTiming,
    checkElectionOwnership,
    checkTimeBasedStatus,
    checkIndividualCandidateVotes,
  ];

  const results = [];

  for (const checkFunction of checks) {
    try {
      const result = await checkFunction(contract, election);
      results.push(result);
    } catch (error) {
      results.push(
        new SecurityCheckResult(
          false,
          'check_execution_error',
          `Failed to execute ${checkFunction.name}: ${error.message}`,
          { checkFunction: checkFunction.name, error: error.message }
        )
      );
    }
  }

  return results;
}

/**
 * Get summary of security check results
 */
function getCheckSummary(results) {
  const passed = results.filter(r => r.passed);
  const failed = results.filter(r => !r.passed);

  return {
    totalChecks: results.length,
    passedChecks: passed.length,
    failedChecks: failed.length,
    passRate: (passed.length / results.length) * 100,
    failedTypes: failed.map(f => f.type),
    criticalIssues: failed.filter(f =>
      ['vote_count_integrity', 'ownership_mismatch', 'timing_mismatch'].includes(f.type)
    ).length,
  };
}

module.exports = {
  SecurityCheckResult,
  checkVoteCountIntegrity,
  checkCandidateIntegrity,
  checkElectionStatus,
  checkElectionTiming,
  checkElectionOwnership,
  checkTimeBasedStatus,
  checkIndividualCandidateVotes,
  runAllSecurityChecks,
  getCheckSummary,
};
