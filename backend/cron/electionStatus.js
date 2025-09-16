const cron = require('node-cron');
const { pool } = require('../database/db');

/**
 * Determine election status based on current time vs start/end dates
 */
const determineElectionStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return 'upcoming';
  } else if (now >= start && now <= end) {
    return 'active';
  } else if (now > end) {
    return 'completed';
  }
  return 'upcoming';
};

/**
 * Update election statuses based on current time
 */
async function updateElectionStatuses() {
  const startTime = Date.now();
  console.log(`🕐 [CRON] Starting election status update at ${new Date().toISOString()}`);

  try {
    // Get all non-cancelled, non-draft elections
    const electionsResult = await pool.query(`
      SELECT id, title, start_date, end_date, status, smart_contract_address
      FROM elections 
      WHERE status != 'cancelled' 
      AND is_draft = false 
      AND revoked = false
      ORDER BY id
    `);

    const elections = electionsResult.rows;
    console.log(`📊 [CRON] Found ${elections.length} elections to check`);

    let updatedCount = 0;
    const statusChanges = [];

    for (const election of elections) {
      const currentStatus = election.status;
      const calculatedStatus = determineElectionStatus(election.start_date, election.end_date);

      // Only update if status has changed
      if (currentStatus !== calculatedStatus) {
        await pool.query(
          `
          UPDATE elections 
          SET status = $1, updated_at = CURRENT_TIMESTAMP 
          WHERE id = $2
        `,
          [calculatedStatus, election.id]
        );

        updatedCount++;
        statusChanges.push({
          id: election.id,
          title: election.title,
          oldStatus: currentStatus,
          newStatus: calculatedStatus,
          contractAddress: election.smart_contract_address,
        });

        console.log(
          `✅ [CRON] Election ${election.id} "${election.title}": ${currentStatus} → ${calculatedStatus}`
        );
      }
    }

    const duration = Date.now() - startTime;

    if (updatedCount > 0) {
      console.log(
        `[CRON] Updated ${updatedCount}/${elections.length} election statuses in ${duration}ms`
      );
      console.log('📋 Status changes:', statusChanges);
    } else {
      console.log(
        `✨ [CRON] All ${elections.length} election statuses are up to date (${duration}ms)`
      );
    }

    return {
      success: true,
      totalChecked: elections.length,
      totalUpdated: updatedCount,
      statusChanges,
      duration,
    };
  } catch (error) {
    console.error('❌ [CRON] Error updating election statuses:', error);
    return {
      success: false,
      error: error.message,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Setup cron jobs for election status updates
 */
function setupElectionStatusCron() {
  // Run every 5 minutes
  const cronJob = cron.schedule(
    '*/5 * * * *',
    async () => {
      await updateElectionStatuses();
    },
    {
      scheduled: false, // Don't start automatically
      timezone: 'UTC',
    }
  );

  // Also run every hour as backup (in case 5-minute job fails)
  const hourlyCronJob = cron.schedule(
    '0 * * * *',
    async () => {
      console.log('🔄 [CRON] Running hourly election status backup check...');
      await updateElectionStatuses();
    },
    {
      scheduled: false,
      timezone: 'UTC',
    }
  );

  console.log('⚙️  Election status cron jobs configured:');
  console.log('   - Every 5 minutes: */5 * * * *');
  console.log('   - Every hour (backup): 0 * * * *');

  return {
    primary: cronJob,
    backup: hourlyCronJob,
    start() {
      cronJob.start();
      hourlyCronJob.start();
      console.log('🚀 Election status cron jobs started');

      // Run once immediately to catch any pending updates
      setTimeout(updateElectionStatuses, 1000);
    },
    stop() {
      cronJob.stop();
      hourlyCronJob.stop();
      console.log('🛑 Election status cron jobs stopped');
    },
  };
}

/**
 * Manual function to update statuses immediately (for testing)
 */
async function updateElectionStatusesNow() {
  console.log('🔧 [MANUAL] Running manual election status update...');
  return await updateElectionStatuses();
}

module.exports = {
  setupElectionStatusCron,
  updateElectionStatusesNow,
  updateElectionStatuses,
  determineElectionStatus,
};
