
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Download, FileDown, PauseCircle, Play, Download as Export, BarChart3, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LiveElection {
  id: string;
  title: string;
  organization: string;
  totalVoters: number;
  votesSubmitted: number;
  endDate: Date;
  isPaused: boolean;
}

const liveElection: LiveElection = {
  id: '1',
  title: 'City Council Election 2025',
  organization: 'Civic Association',
  totalVoters: 1245,
  votesSubmitted: 568,
  endDate: new Date('2025-05-15'),
  isPaused: false
};

export const ElectionControls = () => {
  const { toast } = useToast();
  const [election, setElection] = useState(liveElection);
  
  const togglePause = () => {
    setElection(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
    
    toast({
      title: election.isPaused ? "Election Resumed" : "Election Paused",
      description: election.isPaused 
        ? "Voters can now submit their votes again."
        : "The election has been paused. No new votes can be submitted until resumed.",
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
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{election.title}</CardTitle>
            <p className="text-sm text-gray-500">{election.organization}</p>
          </div>
          <Badge variant={election.isPaused ? "destructive" : "default"}>
            {election.isPaused ? "Paused" : "Live"}
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
                {election.totalVoters}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Votes Submitted</div>
              <div className="text-2xl font-bold flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-gray-500" />
                {election.votesSubmitted}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Participation Rate</div>
              <div className="text-2xl font-bold">
                {Math.round((election.votesSubmitted / election.totalVoters) * 100)}%
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
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
            
            <Button
              variant="outline"
              className="flex items-center"
              onClick={exportVoters}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export Voter List
            </Button>
          </div>
          
          {election.isPaused && (
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
