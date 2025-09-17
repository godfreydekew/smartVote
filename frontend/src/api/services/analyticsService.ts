import apiClient from '../config';
import type { AxiosError } from 'axios';

export type VoteOverTime = {
  hour: string;
  candidate_id: number;
  candidate_name: string;
  vote_count: number;
};

export type DemographicDistribution = {
  male: number;
  female: number;
  other: number;
};

export type RegionalDistribution = Record<string, number>;

export type ElectionAnalyticsSummary = {
  electionId: number;
  title: string;
  start_date?: string | null;
  end_date?: string | null;

  total_votes: number;
  total_eligible_voters: number;
  voter_turnout_percentage: number;

  gender_distribution: DemographicDistribution;
  regional_distribution: RegionalDistribution;

  per_candidate_counts?: { candidate_id: number; candidate_name?: string; votes: number }[];

  last_vote_at?: string | null;
};

export type AnalyticsResponse = {
  analytics: ElectionAnalyticsSummary;
  votesOverTime: VoteOverTime[];
};

function axe(err: unknown): Error {
  if (!err) return new Error('Unknown error');
  if ((err as AxiosError).isAxiosError) {
    const aerr = err as AxiosError<any>;
    const status = aerr.response?.status;
    const data = aerr.response?.data;
    const msg =
      (data && (data.error || data.message || JSON.stringify(data))) ||
      aerr.message ||
      `Request failed${status ? ` (${status})` : ''}`;
    const e = new Error(msg);
    (e as any).status = status;
    return e;
  }
  return err instanceof Error ? err : new Error(String(err));
}

/**
 * Fetch analytics for a single election.
 */
export async function getElectionAnalytics(
  electionId: string | number,
  opts?: { from?: string; to?: string; granularity?: 'minute' | 'hour' | 'day' }
): Promise<AnalyticsResponse> {
  try {
    const params: Record<string, string> = {};
    if (opts?.from) params.from = opts.from;
    if (opts?.to) params.to = opts.to;
    if (opts?.granularity) params.granularity = opts.granularity;

    const url = `/analytics/${encodeURIComponent(String(electionId))}`;
    const resp = await apiClient.get<AnalyticsResponse>(url, { params });
    return resp.data;
  } catch (err) {
    throw axe(err);
  }
}

/**
 * Get owner/global overview
 */
export async function getOverview(opts?: {
  ownerUserId?: number;
  ownerAddress?: string;
}): Promise<{ totals: { elections: number; total_votes: number; unique_voters?: number } }> {
  try {
    const params: Record<string, string> = {};
    if (opts?.ownerUserId) params.ownerUserId = String(opts.ownerUserId);
    if (opts?.ownerAddress) params.ownerAddress = opts.ownerAddress!;
    const resp = await apiClient.get('/analytics/overview', { params });
    return resp.data;
  } catch (err) {
    throw axe(err);
  }
}

/**
 * Batch fetch summaries for many elections in one request.
 */
export async function getElectionsSummaries(ids: number[]): Promise<ElectionAnalyticsSummary[]> {
  if (!ids || ids.length === 0) return [];

  try {
    const resp = await apiClient.post<{ summaries: ElectionAnalyticsSummary[] }>(
      '/analytics/elections/batch',
      { ids }
    );
    return resp.data.summaries;
  } catch (err) {
    // fallback: parallel GETs (still better to implement batch on backend)
    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          const r = await getElectionAnalytics(id);
          return r.analytics;
        })
      );
      return results;
    } catch (innerErr) {
      throw axe(err); // original batch error is more informative
    }
  }
}

/**
 * Mock helper for development (frontend can call this until backend is ready)
 */
export function mockElectionAnalytics(id: string | number): AnalyticsResponse {
  const now = new Date();
  const votesOverTime: VoteOverTime[] = [];
  for (let i = 24; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const iso = d.toISOString();
    votesOverTime.push(
      { hour: iso, candidate_id: 1, candidate_name: 'Alice', vote_count: Math.round(Math.random() * 20) },
      { hour: iso, candidate_id: 2, candidate_name: 'Bob', vote_count: Math.round(Math.random() * 30) }
    );
  }

  const analytics: ElectionAnalyticsSummary = {
    electionId: Number(id),
    title: `Mock Election ${id}`,
    total_votes: votesOverTime.reduce((acc, v) => acc + v.vote_count, 0),
    total_eligible_voters: 2000,
    voter_turnout_percentage: Math.round((Math.random() * 70 + 10) * 10) / 10,
    gender_distribution: { male: 600, female: 400, other: 5 },
    regional_distribution: { Europe: 400, Asia: 350, Africa: 150, Americas: 150 },
    per_candidate_counts: [
      { candidate_id: 1, candidate_name: 'Alice', votes: 800 },
      { candidate_id: 2, candidate_name: 'Bob', votes: 750 },
    ],
    last_vote_at: new Date().toISOString(),
  };

  return { analytics, votesOverTime };
}

export default {
  getElectionAnalytics,
  getOverview,
  getElectionsSummaries,
  mockElectionAnalytics,
};
