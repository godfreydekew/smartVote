const { pool } = require('../../db');

// general overview analytics per user.
const fetchGeneralOverview = async (ownerUserId) => {
  const query = `
    SELECT
        COUNT(*) AS total_elections,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_elections,
        SUM(CASE WHEN status = 'upcoming' THEN 1 ELSE 0 END) AS upcoming_elections,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_elections,
        AVG(EXTRACT(EPOCH FROM (end_date - start_date)))) AS average_duration_seconds,
        (SELECT title FROM elections WHERE owner_user_id = $1 ORDER BY (end_date - start_date) DESC LIMIT 1) AS longest_election_title,
        (SELECT title FROM elections WHERE owner_user_id = $1 ORDER BY (end_date - start_date) ASC LIMIT 1) AS shortest_election_title
    FROM elections
    WHERE owner_user_id = $1;
  `;
  const { rows } = await pool.query(query, [ownerUserId]);
  return rows[0];
};

// per election analytics
const fetchElectionAnalytics = async (electionId) => {
    const query = `
        SELECT
            e.title,
            e.total_votes,
            (SELECT COUNT(*) FROM eligible_voters ev WHERE ev.election_id = e.id) AS total_eligible_voters,
            ea.voter_turnout_percentage,
            ea.gender_distribution,
            ea.regional_distribution
        FROM elections e
        LEFT JOIN election_analytics ea ON e.id = ea.election_id
        WHERE e.id = $1;
    `;
    const { rows } = await pool.query(query, [electionId]);
    return rows[0];
};

// time series(ed) data for votes per candidate in an election.
const fetchVotesOverTime = async (electionId) => {
    const query = `
        SELECT
            time_bucket('1 hour', time) AS hour,
            c.name as candidate_name,
            COUNT(*) AS vote_count
        FROM vote_log vl
        JOIN candidates c ON vl.candidate_id = c.id
        WHERE vl.election_id = $1
        GROUP BY hour, c.name
        ORDER BY hour;
    `;
    const { rows } = await pool.query(query, [electionId]);
    return rows;
}


module.exports = {
  fetchGeneralOverview,
  fetchElectionAnalytics,
  fetchVotesOverTime
};