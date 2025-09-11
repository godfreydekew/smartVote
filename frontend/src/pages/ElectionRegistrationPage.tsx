import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthProvider'; // Assuming you have an AuthProvider

const ElectionRegistrationPage = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const { user, publicKey } = useAuth(); // Assuming useAuth provides user and their public key
  const [election, setElection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Fetch election details
    const fetchElection = async () => {
      try {
        const response = await fetch(`/api/election/${electionId}`);
        if (!response.ok) throw new Error('Failed to fetch election details.');
        const data = await response.json();
        setElection(data.election);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchElection();
  }, [electionId]);

  const handleRegister = async () => {
    if (!publicKey) {
      setError('Public key not available. Please ensure you are logged in.');
      return;
    }

    try {
      const response = await fetch(`/api/election/register/${electionId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicKey }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to register.');
      }

      setIsRegistered(true);

    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) return <div>Loading election details...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!election) return <div>Election not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register for Election: {election.title}</h1>
      <p className="mb-4">{election.description}</p>
      
      {isRegistered ? (
        <p className="text-green-500 font-bold">You have successfully registered to vote in this election!</p>
      ) : (
        <div>
          <p className="mb-4">Click the button below to register your public key and become an eligible voter for this private election.</p>
          <Button onClick={handleRegister} disabled={!user}>
            {user ? 'Register to Vote' : 'Please Log In to Register'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ElectionRegistrationPage;
