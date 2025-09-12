import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, CheckCircle2, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useReadContract } from "thirdweb/react";
import { singleElectionContract, electionFactoryContract } from '@/utils/thirdweb-client';
import { useAuth } from '@/auth/AuthProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { electionService } from '@/api';
import { useToast } from '@/hooks/use-toast';

// Map frontend states to contract states
const stateMapping = {
  'upcoming': 0, // UPCOMING
  'active': 1,   // ACTIVE
  'completed': 2 // COMPLETED
};

const COLORS = {
  active: 'rgba(0, 136, 254, 0.9)',    // Blue
  upcoming: 'rgba(0, 196, 159, 0.9)',  // Teal
  completed: 'rgba(136, 132, 216, 0.9)' // Purple
};

const HOVER_COLORS = {
  active: 'rgba(0, 136, 254, 1)',    // Blue
  upcoming: 'rgba(0, 196, 159, 1)',  // Teal
  completed: 'rgba(136, 132, 216, 1)' // Purple
};

interface ElectionData {
  readonly electionAddress: string;
  readonly id: bigint;
  readonly title: string;
  readonly startTime: bigint;
  readonly endTime: bigint;
  readonly isPublic: boolean;
  readonly owner: string;
}

export const AdminOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Get all elections by owner
  const { data: ownerElections, isPending: isOwnerPending } = useReadContract({
    contract: electionFactoryContract,
    method: "function getElectionsByOwner(address owner) view returns ((address electionAddress, uint256 id, string title, uint256 startTime, uint256 endTime, bool isPublic, address owner)[])",
    params: [user?.address],
  });

  // Get elections by state
  const { data: activeElections, isPending: isActivePending } = useReadContract({
    contract: electionFactoryContract,
    method: "function getElectionsByState(uint8 _state) view returns ((address electionAddress, uint256 id, string title, uint256 startTime, uint256 endTime, bool isPublic, address owner)[])",
    params: [stateMapping['active']],
  });

  const { data: upcomingElections, isPending: isUpcomingPending } = useReadContract({
    contract: electionFactoryContract,
    method: "function getElectionsByState(uint8 _state) view returns ((address electionAddress, uint256 id, string title, uint256 startTime, uint256 endTime, bool isPublic, address owner)[])",
    params: [stateMapping['upcoming']],
  });

  const { data: completedElections, isPending: isCompletedPending } = useReadContract({
    contract: electionFactoryContract,
    method: "function getElectionsByState(uint8 _state) view returns ((address electionAddress, uint256 id, string title, uint256 startTime, uint256 endTime, bool isPublic, address owner)[])",
    params: [stateMapping['completed']],
  });

  // Filter elections by owner address
  const filterElectionsByOwner = (elections: readonly ElectionData[] | undefined) => {
    if (!elections || !user?.address) return [];
    return elections.filter(election => election.owner.toLowerCase() === user.address.toLowerCase());
  };

  // Apply filters to get admin's elections
  const adminActiveElections = filterElectionsByOwner(activeElections);
  const adminUpcomingElections = filterElectionsByOwner(upcomingElections);
  const adminCompletedElections = filterElectionsByOwner(completedElections);

  // Calculate statistics using filtered data
  const activeElectionsCount = adminActiveElections.length;
  const upcomingElectionsCount = adminUpcomingElections.length;
  const completedElectionsCount = adminCompletedElections.length;
  const totalElections = (ownerElections?.length || 0);

  // Calculate percentage distribution
  const distributionData = [
    { name: 'Active', value: activeElectionsCount },
    { name: 'Upcoming', value: upcomingElectionsCount },
    { name: 'Completed', value: completedElectionsCount },
  ];

  // Calculate average election duration
  const calculateAverageDuration = (elections: readonly ElectionData[] | undefined) => {
    if (!elections || elections.length === 0) return 0;
    const totalDuration = elections.reduce((acc, election) => {
      const duration = Number(election.endTime) - Number(election.startTime);
      return acc + duration;
    }, 0);
    return totalDuration / elections.length;
  };

  // Find longest and shortest elections
  const findLongestElection = (elections: readonly ElectionData[] | undefined) => {
    if (!elections || elections.length === 0) return null;
    return elections.reduce((longest, current) => {
      const currentDuration = Number(current.endTime) - Number(current.startTime);
      const longestDuration = Number(longest.endTime) - Number(longest.startTime);
      return currentDuration > longestDuration ? current : longest;
    });
  };

  const findShortestElection = (elections: readonly ElectionData[] | undefined) => {
    if (!elections || elections.length === 0) return null;
    return elections.reduce((shortest, current) => {
      const currentDuration = Number(current.endTime) - Number(current.startTime);
      const shortestDuration = Number(shortest.endTime) - Number(shortest.startTime);
      return currentDuration < shortestDuration ? current : shortest;
    });
  };

  // Get elections starting soon (within 24 hours)
  const getElectionsStartingSoon = (elections: readonly ElectionData[] | undefined) => {
    if (!elections) return [];
    const now = Math.floor(Date.now() / 1000);
    const oneDay = 24 * 60 * 60;
    return elections.filter(election => {
      const startTime = Number(election.startTime);
      return startTime > now && startTime <= now + oneDay;
    });
  };

  // Get recently completed elections (within 24 hours)
  const getRecentlyCompleted = (elections: readonly ElectionData[] | undefined) => {
    if (!elections) return [];
    const now = Math.floor(Date.now() / 1000);
    const oneDay = 24 * 60 * 60;
    return elections.filter(election => {
      const endTime = Number(election.endTime);
      return endTime < now && endTime >= now - oneDay;
    });
  };

  const electionsStartingSoon = getElectionsStartingSoon(adminUpcomingElections);
  const recentlyCompleted = getRecentlyCompleted(adminCompletedElections);
  const longestElection = findLongestElection(ownerElections);
  const shortestElection = findShortestElection(ownerElections);
  const averageDuration = calculateAverageDuration(ownerElections);

  const handleStartElection = async (electionId: bigint) => {
    try {
      await electionService.startElection(Number(electionId));
      toast({
        title: 'Election Started',
        description: 'The election has been successfully started.',
      });
      // Optionally, refetch data to update the UI
      // queryClient.invalidateQueries('ownerElections');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start election.',
        variant: 'destructive',
      });
      console.error('Error starting election:', error);
    }
  };

  if (isOwnerPending || isActivePending || isUpcomingPending || isCompletedPending) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vote-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Active Elections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-600">{activeElectionsCount}</div>
              <div className="text-sm text-gray-500">Currently Running</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-teal-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-500" />
              Upcoming Elections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-teal-600">{upcomingElectionsCount}</div>
              <div className="text-sm text-gray-500">Scheduled</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-500" />
              Completed Elections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-purple-600">{completedElectionsCount}</div>
              <div className="text-sm text-gray-500">Finished</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Total Elections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">{totalElections}</div>
              <div className="text-sm text-gray-500">All Time</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Additional Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Election Distribution Pie Chart */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-800">Election Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={true}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} 
                        className="transition-colors duration-200"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value} elections`, 'Count']}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    formatter={(value: string) => (
                      <span className="text-sm font-medium text-gray-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Election Duration Statistics */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-800">Election Duration Statistics</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-1">Average Duration</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(averageDuration / (24 * 60 * 60))} days
                </p>
              </div>
              {longestElection && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm font-medium text-gray-600 mb-1">Longest Election</p>
                  <p className="text-lg font-semibold text-gray-900">{longestElection.title}</p>
                  <p className="text-sm text-gray-500">
                    {Math.round((Number(longestElection.endTime) - Number(longestElection.startTime)) / (24 * 60 * 60))} days
                  </p>
                </div>
              )}
              {shortestElection && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm font-medium text-gray-600 mb-1">Shortest Election</p>
                  <p className="text-lg font-semibold text-gray-900">{shortestElection.title}</p>
                  <p className="text-sm text-gray-500">
                    {Math.round((Number(shortestElection.endTime) - Number(shortestElection.startTime)) / (24 * 60 * 60))} days
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Elections Starting Soon */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-800">Starting Soon</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {electionsStartingSoon.length > 0 ? (
                electionsStartingSoon.map((election) => (
                  <div key={election.id.toString()} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                    <p className="font-medium text-gray-900">{election.title}</p>
                    <p className="text-sm text-gray-500">
                      Starts in {Math.round((Number(election.startTime) - Math.floor(Date.now() / 1000)) / 3600)} hours
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No elections starting soon</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recently Completed */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-800">Recently Completed</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentlyCompleted.length > 0 ? (
                recentlyCompleted.map((election) => (
                  <div key={election.id.toString()} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                    <p className="font-medium text-gray-900">{election.title}</p>
                    <p className="text-sm text-gray-500">
                      Completed {Math.round((Math.floor(Date.now() / 1000) - Number(election.endTime)) / 3600)} hours ago
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recently completed elections</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Elections with Start Button */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-800">Upcoming Elections</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {adminUpcomingElections.length > 0 ? (
              adminUpcomingElections.map((election) => (
                <div key={election.id.toString()} className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{election.title}</p>
                    <p className="text-sm text-gray-500">
                      Starts: {new Date(Number(election.startTime) * 1000).toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleStartElection(election.id)}
                    variant="outline"
                    size="sm"
                  >
                    Start Now
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming elections</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};