const cron = require('node-cron');
const { pool } = require('../database/db');
const fetchAllElections = require('../database/queries/elections/fetchElection').fetchAllElections;
const { singleElectionContract } = require('../utils/thirdwebClient');
const { runAllSecurityChecks, getCheckSummary } = require('./security-checks');
const { updateElectionStatusesNow } = require('./electionStatus');

/**
 * Maps AutoElection contract ElectionState enum to database status strings
 * Contract enum: UPCOMING=0, ACTIVE=1, COMPLETED=2, CANCELLED=3
 */
const mapChainStatusToDb = chainStatus => {
  const statusMap = {
    0: 'upcoming', // ElectionState.UPCOMING
    1: 'active', // ElectionState.ACTIVE
    2: 'completed', // ElectionState.COMPLETED
    3: 'cancelled', // ElectionState.CANCELLED
  };
  return statusMap[Number(chainStatus)] || 'unknown';
};

/**
 * Logging function with timestamps
 */
const logSecurityEvent = (level, electionId, message, details = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] Election ${electionId}: ${message}`);
  if (details) {
    console.log('Details:', JSON.stringify(details, null, 2));
  }
};

/**
 * Main security check function that compares database data with smart contract data
 */
async function checkElectionSecurity() {
  console.log('=== ELECTION SECURITY AUDIT STARTED ===');

  await updateElectionStatusesNow();

  const auditStartTime = new Date();
  let checkedCount = 0;
  let totalViolations = 0;

  try {
    const elections = await fetchAllElections();

    // Filter elections with valid contract addresses
    const electionsWithContracts = elections.filter(
      e =>
        e.smart_contract_address &&
        e.smart_contract_address.startsWith('0x') &&
        e.smart_contract_address.length === 42
    );

    console.log(`[AUDIT] Found ${electionsWithContracts.length} elections to audit`);

    for (const election of electionsWithContracts) {
      try {
        checkedCount++;
        const contract = singleElectionContract(election.smart_contract_address);

        logSecurityEvent('info', election.id, `Running ${7} security checks...`);

        // Run all security checks
        const checkResults = await runAllSecurityChecks(contract, election);
        const summary = getCheckSummary(checkResults);

        // Log results
        logSecurityEvent(
          'info',
          election.id,
          `Security audit complete: ${summary.passedChecks}/${summary.totalChecks} passed`,
          summary
        );

        // Handle violations
        const violations = checkResults.filter(r => !r.passed);
        totalViolations += violations.length;

        if (violations.length > 0) {
          // Insert breach record
          const breachDescription = violations.map(v => `${v.type}: ${v.message}`).join('; ');

          await pool.query(
            `INSERT INTO breaches (election_id, issue_type, description, detected_at)
             VALUES ($1, $2, $3, $4)`,
            [election.id, violations.map(v => v.type).join(','), breachDescription, auditStartTime]
          );

          logSecurityEvent('error', election.id, '🚨 SECURITY VIOLATIONS DETECTED', violations);
        } else {
          logSecurityEvent('info', election.id, '✅ All security checks passed');
        }

        // Log to audit table
        await pool.query(
          `INSERT INTO security_audit_logs 
           (election_id, check_time, discrepancy_found, details) 
           VALUES ($1, $2, $3, $4)`,
          [
            election.id,
            auditStartTime,
            violations.length > 0,
            JSON.stringify({
              summary,
              violations: violations.map(v => ({
                type: v.type,
                message: v.message,
                details: v.details,
              })),
            }),
          ]
        );
      } catch (electionError) {
        logSecurityEvent('error', election.id, `Audit failed: ${electionError.message}`);
      }
    }
  } catch (globalError) {
    console.error('🚨 [AUDIT] CRITICAL ERROR:', globalError.message);
  }

  // Summary
  console.log(`\n=== AUDIT COMPLETE ===`);
  console.log(`📊 Elections: ${checkedCount}`);
  console.log(`⚠️  Total violations: ${totalViolations}`);
  console.log(`⏱️  Duration: ${Date.now() - auditStartTime.getTime()}ms`);
}

/**
 * Initialize and start the security monitoring cron job
 */
function startElectionSecurityCron() {
  console.log('🔐 [CRON] Initializing Election Security Monitor...');

  // Schedule: Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    try {
      console.log('\n🔍 [CRON] Scheduled security check triggered...');
      await checkElectionSecurity();
    } catch (error) {
      console.error('🚨 [CRON] Unhandled error in scheduled security check:', error.message);
    }
  });

  console.log('✅ [CRON] Election Security Monitor started');
  console.log('📅 [CRON] Running every 1 minute (change to every 10 minutes in production)');
  console.log('🛑 [CRON] To stop: Ctrl+C or process termination\n');
}

/**
 * Manual trigger function for testing
 */
async function runSecurityCheckNow() {
  console.log('🔧 [MANUAL] Triggering immediate security check...\n');
  try {
    await checkElectionSecurity();
    console.log('✅ [MANUAL] Manual security check completed successfully');
  } catch (error) {
    console.error('❌ [MANUAL] Manual security check failed:', error.message);
    throw error;
  }
}

// Export functions
module.exports = {
  startElectionSecurityCron,
  runSecurityCheckNow,
  checkElectionSecurity,
  mapChainStatusToDb,
};

// For Testing
if (require.main === module) {
  console.log('🧪 Running security check in test mode...\n');
  runSecurityCheckNow()
    .then(() => {
      console.log('✅ Test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Test failed:', error.message);
      process.exit(1);
    });
}
