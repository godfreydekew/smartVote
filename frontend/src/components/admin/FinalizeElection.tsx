import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FinalizeElectionProps {
  electionId: string;
  electionStatus: string;
}

const FinalizeElection: React.FC<FinalizeElectionProps> = ({ electionId, electionStatus }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [finalizationDate, setFinalizationDate] = useState('');

  const handleApiCall = async (endpoint: string, body: object) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'An error occurred.');
      }
      
      setIsComplete(true);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = () => {
    if (!finalizationDate) {
        setError('Please select a date to schedule finalization.');
        return;
    }
    handleApiCall(`/api/election/schedule-finalization/${electionId}`, { finalizationDate });
  };

  const handleFinalizeNow = () => {
    handleApiCall(`/api/election/finalize-now/${electionId}`, {});
  };

  if (electionStatus !== 'REGISTRATION') {
    return <p className="text-sm text-muted-foreground">This election has already been finalized.</p>;
  }

  if (isComplete) {
    return <p className="text-green-500 font-bold">The election finalization process has been successfully initiated.</p>;
  }

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="font-bold">Finalize Election</h3>
      <p className="text-sm text-muted-foreground">Lock the voter list and prepare the election for voting. This can be done manually now or scheduled for a future date.</p>
      
      <div className="space-y-2">
        <label htmlFor="finalization-date" className="block text-sm font-medium">Schedule Finalization</label>
        <input type="datetime-local" id="finalization-date" value={finalizationDate} onChange={e => setFinalizationDate(e.target.value)} className="input" />
        <Button onClick={handleSchedule} disabled={isLoading || !finalizationDate} className="w-full">
          {isLoading ? 'Scheduling...' : 'Schedule for Later'}
        </Button>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <div>
        <Button onClick={handleFinalizeNow} disabled={isLoading} variant="secondary" className="w-full">
          {isLoading ? 'Finalizing...' : 'Finalize Now'}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
    </div>
  );
};

export default FinalizeElection;
