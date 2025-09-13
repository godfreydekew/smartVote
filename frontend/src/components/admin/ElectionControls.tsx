import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Download, FileDown, PauseCircle, Play, Download as Export, BarChart3, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { electionService } from '@/api';

interface ElectionControlsProps {
  electionId: number;
  onElectionStatusChange?: () => void; // Callback to refetch election data in parent
}

export const ElectionControls = ({ electionId, onElectionStatusChange }: ElectionControlsProps) => {
  const { toast } = useToast();
  const [election, setElection] = useState<any>(null); // Use 'any' for now, define proper interface later
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        setLoading(true);
        const response = await electionService.getElection(electionId);
        setElection(response.election);
      } catch (error) {
        console.error('Error fetching election for controls:', error);
        toast({
          title: 'Error',
          description: 'Failed to load election details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (electionId) {
      fetchElection();
    }
  }, [electionId, onElectionStatusChange]);

  const togglePause = () => {
    // This logic needs to be updated to interact with the backend
    setElection(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'paused' : 'active' // Assuming a 'paused' status
    }));
    
    toast({
      title: election.status === 'active' ? "Election Paused" : "Election Resumed",
      description: election.status === 'active' 
        ? "The election has been paused. No new votes can be submitted until resumed."
        : "Voters can now submit their votes again.",
    });
  };
  
  const exportVoters = () => {
    toast({
      title: "Export Started",
      description: "Voter list is being prepared for download.",
    });
    
    // In a real app, this would trigger a file download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Voter list has been downloaded.",
      });
    }, 1500);
  };

  const handleStartElection = async () => {
    try {
      await electionService.startElection(electionId);
      toast({
        title: 'Election Started',
        description: 'The election has been successfully started.',
      });
      if (onElectionStatusChange) {
        onElectionStatusChange(); // Notify parent to refetch data
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start election.',
        variant: 'destructive',
      });
      console.error('Error starting election:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Loading Controls...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Fetching election data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!election) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Election Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Could not load election details for controls.</p>
        </CardContent>
      </Card>
    );
  }

  const isUpcoming = election.status === 'upcoming';
  const isActive = election.status === 'active';
  const isCompleted = election.status === 'completed';

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{election.title}</CardTitle>
            <p className="text-sm text-gray-500">{election.organization}</p>
          </div>
          <Badge variant={isUpcoming ? "secondary" : isActive ? "default" : "outline"}>
            {isUpcoming ? "Upcoming" : isActive ? "Live" : "Completed"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Total Voters</div>
              <div className="text-2xl font-bold flex items-center">
                <UserCheck className="mr-2 h-5 w-5 text-gray-500" />
                {election.participants} {/* Assuming participants is total voters */}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Votes Submitted</div>
              <div className="text-2xl font-bold flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-gray-500" />
                {election.total_votes}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Participation Rate</div>
              <div className="text-2xl font-bold">
                {election.participants > 0 ? Math.round((election.total_votes / election.participants) * 100) : 0}%
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            {isUpcoming && (
              <Button 
                onClick={handleStartElection}
                variant="default"
                className="flex items-center"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Election Now
              </Button>
            )}

            {isActive && (
              <Button
                variant={election.isPaused ? "default" : "destructive"}
                className="flex items-center"
                onClick={togglePause}
              >
                {election.isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume Election
                  </>
                ) : (
                  <>
                    <PauseCircle className="mr-2 h-4 w-4" />
                    Emergency Pause
                  </>
                )}
              </Button>
            )}
            
            {!isUpcoming && (
              <Button
                variant="outline"
                className="flex items-center"
                onClick={exportVoters}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export Voter List
              </Button>
            )}
          </div>
          
          {election.status === 'paused' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Election is currently paused</p>
                <p>No new votes can be submitted until the election is resumed. All existing votes remain secure.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};