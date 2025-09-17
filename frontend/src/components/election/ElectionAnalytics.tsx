import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, Users, TrendingUp, Clock, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MetricCard } from '../analytics/MetricCard';
import { VoteTurnoutChart } from '../analytics/VoteTurnoutChart';
import { VotesOverTimeChart } from '../analytics/VotesOverTimeChart';
import { DemographicsChart } from '../analytics/DemographicsChart';
import { analyticsService } from '@/api';
import type { AnalyticsResponse } from '@/api/services/analyticsService';

export const ElectionAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const electionTitle = searchParams.get('title') || 'Election Analytics';

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsService.getElectionAnalytics(id);
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
        toast({
          title: 'Error',
          description: 'Failed to load election analytics. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id, toast]);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
          <p className="text-muted-foreground mt-4">Loading analytics...</p>
        </Card>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-destructive">Error</h2>
          <p className="text-muted-foreground mb-6">{error || 'Analytics data not found'}</p>
          <Button onClick={handleGoBack} className="w-full">
            Return to Admin Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const { analytics: electionData, votesOverTime } = analytics;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Election Analytics</h1>
                <p className="text-muted-foreground">{electionData.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-vote-blue" />
              <span className="text-sm font-medium text-muted-foreground">
                Data Analytics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto my-5">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Votes"
            value={electionData.total_votes.toLocaleString()}
            icon={Users}
            variant="primary"
            subtitle="Votes cast"
          />
          <MetricCard
            title="Eligible Voters"
            value={electionData.total_eligible_voters.toLocaleString()}
            icon={Award}
            variant="default"
            subtitle="Registered voters"
          />
          <MetricCard
            title="Voter Turnout"
            value={`${(electionData.voter_turnout_percentage || 0).toFixed(1)}%`}
            icon={TrendingUp}
            variant={electionData.voter_turnout_percentage || 0 >= 70 ? 'success' : 
                   electionData.voter_turnout_percentage || 0 >= 50 ? 'warning' : 'danger'}
            subtitle="Participation rate"
          />
          <MetricCard
            title="Data Points"
            value={votesOverTime.length}
            icon={Clock}
            variant="default"
            subtitle="Hourly recordings"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <VoteTurnoutChart
            totalVotes={electionData.total_votes}
            eligibleVoters={electionData.total_eligible_voters}
            turnoutPercentage={electionData.voter_turnout_percentage || 0}
          />
          <VotesOverTimeChart data={votesOverTime} />
        </div>

        {/* Demographics */}
        <DemographicsChart
          genderDistribution={electionData.gender_distribution}
          regionalDistribution={electionData.regional_distribution || {}}
        />

        {/* Summary Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-6 w-1 bg-vote-blue rounded"></div>
              Election Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Participation</h4>
                <p className="text-sm text-muted-foreground">
                  {electionData.total_votes} out of {electionData.total_eligible_voters} eligible voters participated, 
                  resulting in a {(electionData.voter_turnout_percentage || 0).toFixed(1)}% turnout rate.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Demographics</h4>
                <p className="text-sm text-muted-foreground">
                  Votes were distributed across {Object.keys(electionData.regional_distribution || {}).length} regions 
                  with representation from all demographic groups.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Voting Pattern</h4>
                <p className="text-sm text-muted-foreground">
                  {votesOverTime.length > 0 
                    ? `Voting activity was recorded across ${votesOverTime.length} time periods.`
                    : 'No time-series voting data available.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
