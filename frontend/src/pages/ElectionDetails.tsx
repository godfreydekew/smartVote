import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

import ElectionHeader from '@/components/election/ElectionHeader';
import ElectionDetails from '@/components/election/ElectionDetails';
import ElectionRules from '@/components/election/ElectionRules';
import CandidateList from '@/components/election/CandidateList';
import CandidateDetailDialog from '@/components/election/CandidateDetailDialog';
import VoteConfirmDialog from '@/components/election/VoteConfirmDialog';
import VoteConfirmation from '@/components/vote/VoteConfirmation';
import { BlockchainLogs } from '@/components/election/BlockchainLogs';
import { ElectionAnalytics } from '@/components/election/ElectionAnalytics';

import { electionService } from '@/api';
import { userService } from '@/api';
import { singleElectionContract } from '@/utils/thirdweb-client';
import { useAuth } from '@/auth/AuthProvider';

import { useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { Connect } from '@/components/thirdweb/Connect';

interface BlockchainCandidate {
  id: bigint;
  name: string;
  voteCount: bigint;
}

interface Candidate {
  id: string;
  name: string;
  voteCount: number;
  description?: string;
  imageUrl?: string;
}

const ElectionDetailsPage = () => {
  const { user } = useAuth();
  const [voteTx, setVoteTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const address = searchParams.get('address') || localStorage.getItem('selectedAddress');
  const status = searchParams.get('status');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEligible, setIsEligible] = useState(false);
  
  const [election, setElectionData] = useState<{
    title: string;
    description: string;
    imageUrl: string;
    status: string;
    startDate: Date;
    endDate: Date;
    totalVotes: number;
    participants: number;
    progress: number;
    rules: string[];
    type: 'public' | 'private' | 'invite-only';
    kyc_required?: boolean;
    age_restriction?: [number, number];
    regions?: string[];
  } | null>(null);
  const [candidates, setCandidateData] = useState<Candidate[] | null>(null);

  const singleElection = singleElectionContract(address);

  console.log(user, 'User from ElectionDetailsPage');

  // Fetch candidates for a specific contract 
  const { data: blockchainCandidates, isPending: isLoadingCandidates } = useReadContract({
    contract: singleElection,
    method:
      "function getCandidates() view returns ((uint256 id, string name, uint256 voteCount)[])",
    params: [],
  });

  // const { data: singleCandidate, isPending: isLoadingSingleCandidate } = useReadContract({
  //   contract: singleElection,
  //   method:
  //     "function candidates(uint256) view returns (uint256 id, string name, uint256 voteCount)",
  //   params: [BigInt(election?.id)],
  // });

  // Get elections details from smart contract
  const { data: electionDetails, isPending: isLoadingElectionDetails } = useReadContract({
    contract: singleElection,
    method:
      "function getElectionDetails() view returns (uint256 id, string title, uint256 startTime, uint256 endTime, uint8 state, bool isPublic, uint256 totalVotes)",
    params: [],
  });

  // Check if user has voted in the smart contract 
  const { data: hasUserVoted, isPending: isCheckingVoteStatus } = useReadContract({
    contract: singleElection,
    method: "function hasVoted(address voter) view returns (bool)",
    params: [user?.address],
  });

  // Get remaining time from smart contract
  const { data: remainingTime, isPending: isLoadingTimeRemaining } = useReadContract({
    contract: singleElection,
    method:
      "function timeRemaining() view returns (uint256)",
    params: [],
  });

  const { mutateAsync: sendVote } = useSendTransaction();

  // const transaction = prepareContractCall({
  //   contract: singleElection,
  //   method: "function vote(uint256 _candidateId)",
  //   params: [_candidateId],
  // });



  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        setLoading(true);

        // Fetch election details from the database
        const response = await electionService.getElection(Number(id));
        console.log('Election from the frontend :', response.election);

        const candresponse = await electionService.getCandidates(Number(id));

        if (response) {
          // Get blockchain vote count
          const blockchainVoteCount = electionDetails ? Number(electionDetails[6]) : 0;
          const databaseVoteCount = response.election.total_votes;

          // Security check for vote count mismatch
          if (blockchainVoteCount !== databaseVoteCount) {
            console.error('SECURITY ALERT: Vote count mismatch detected!', {
              blockchainVoteCount,
              databaseVoteCount,
              difference: Math.abs(blockchainVoteCount - databaseVoteCount)
            });
          }

          const electionData = {
            title: response.election.title,
            description: response.election.description,
            imageUrl: response.election.image_url,
            status: status,
            startDate: new Date(Number(electionDetails[2]) * 1000), 
            endDate: new Date(Number(electionDetails[3]) * 1000), 
            totalVotes: blockchainVoteCount, 
            participants: response.election.participants,
            progress: response.election.progress,
            rules: response.election.rules,
            type: response.election.type,
            kyc_required: response.election.kyc_required,
            age_restriction: response.election.age_restriction,
            regions: response.election.regions,
          };

          setElectionData(electionData);
          setCandidateData(candresponse.candidates);

          if (user) {
            const eligibilityResponse = await electionService.isEligible(Number(id));
            setIsEligible(eligibilityResponse.isEligible);
          }
        } else {
          console.error('Election not found');
        }
      } catch (error) {
        console.error('Error fetching election data:', error);
      } 
    };

    fetchElectionData();
  }, [electionDetails, id, status, user]); // Added electionDetails as a dependency

  useEffect(() => {
    if (user?.address && election && candidates) {
      setLoading(false);
    }
  }, [user?.address, election, candidates]);
  
  // State for candidate detail modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // State for voting confirmation dialog
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [candidateToVote, setCandidateToVote] = useState<Candidate | null>(null);

  // State for vote confirmation screen
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);

  // Convert blockchain candidates to match frontend
  useEffect(() => {
    if (blockchainCandidates) {
      const formattedCandidates: Candidate[] = blockchainCandidates.map((candidate: BlockchainCandidate) => ({
        id: candidate.id.toString(),
        name: candidate.name,
        voteCount: Number(candidate.voteCount)
      }));

      setCandidateData(formattedCandidates);
    }
  }, [blockchainCandidates]);

  // Get election data or show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        {/* Render off-screen */}
        <div className="fixed left-[9999px]">
          <Connect />
        </div>
        
        <Card className="w-full max-w-md p-6 text-center relative">
          <h2 className="text-2xl font-bold mb-4">Loading Election Details...</h2>
          <p className="text-gray-600 mb-6">Please wait while we fetch the election data.</p>
        </Card>
      </div>
    );
  }
  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Election Not Found</h2>
          <p className="text-gray-600 mb-6">The election you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const isActive = election.status === 'active';
  const isUpcoming = election.status === 'upcoming';
  const isCompleted = election.status === 'completed';

  // Calculate time remaining for active elections
  const getTimeRemaining = () => {
    if (!isActive) return null;

    const endDate = new Date(election.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();

    if (diffTime <= 0) return 'Ending today';

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? `${diffDays} day remaining` : `${diffDays} days remaining`;
  };


  const openCandidateDetail = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const closeCandidateDetail = () => {
    setSelectedCandidate(null);
  };

  const initiateVote = (candidate: Candidate) => {
    setCandidateToVote(candidate);
    setVoteDialogOpen(true);
    if (selectedCandidate) closeCandidateDetail();
  };

  const confirmVote = async () => {
    try {
      // Check database vote status
      const dbVoteResponse = await userService.hasVoted(id);
      
      // Check blockchain vote status
      const blockchainVoteStatus = hasUserVoted;

      // Security check for vote status mismatch
      if (dbVoteResponse.hasVoted !== blockchainVoteStatus) {
        console.error('SECURITY ALERT: Vote status mismatch detected!', {
          blockchainVoteStatus,
          databaseVoteStatus: dbVoteResponse.hasVoted,
          userAddress: user?.address
        });
        toast({
          title: 'Warning Alert',
          description: 'You have already voted in this election. \n If you think there was a mistake Please contact support.',
          variant: 'destructive',
        });
        return;
      }

      if (dbVoteResponse.hasVoted || blockchainVoteStatus) {
        toast({
          title: 'Vote Confirmation',
          description: `You have already voted in this election.`, 
          duration: 1000,
        });
        return;
      }

      // Prepare blockchain transaction
      const transaction = prepareContractCall({
        contract: singleElection,
        method: "function vote(uint256 _candidateId)",
        params: [BigInt(candidateToVote.id)],
      });

      // Send blockchain transaction
      const txResult = await sendVote(transaction);

      // If blockchain transaction successful, record in database
      if (txResult) {
        const voteResponse = await electionService.vote(Number(id));
        setVoteTx(txResult);
        if (voteResponse) {
          toast({
            title: 'Vote Successful',
            description: `You have successfully voted for ${candidateToVote.name}.`,
            duration: 1000,
          });
        }
      }

    } catch (error) {
      console.error('Error during voting process:', error);
      toast({
        title: 'Voting Error',
        description: 'There was an error processing your vote. Please try again.',
        variant: 'destructive',
      });
    }
    setVoteDialogOpen(false);
    setShowVoteConfirmation(true);
  };

  const closeVoteConfirmation = () => {
    setShowVoteConfirmation(false);
    setCandidateToVote(null);
  };

  // If showing vote confirmation, render the vote confirmation component
  if (showVoteConfirmation && candidateToVote) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-b px-6 py-4">
            <div className="flex items-center">
              <Button variant="ghost" className="mr-4" onClick={closeVoteConfirmation}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Vote Confirmation</h1>
            </div>
          </div>
          <VoteConfirmation candidateName={candidateToVote.name} onReturn={closeVoteConfirmation} transaction={voteTx}/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Election Header */}
      <ElectionHeader
        title={election.title}
        description={election.description}
        imageUrl={election.imageUrl}
        status={election.status}
        timeRemaining={getTimeRemaining()}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Election Stats Section */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div>
            <ElectionDetails
              startDate={election.startDate}
              endDate={election.endDate}
              participants={election.participants}
              totalVotes={election.totalVotes}
              isActive={isActive}
              type={election.type}
              kycRequired={election.kyc_required}
              ageRestriction={election.age_restriction}
              regions={election.regions}
            />
          </div>

          <div>
            <ElectionRules rules={election.rules} isActive={isActive} isUpcoming={isUpcoming} />
          </div>
        </div>

        {/* Candidates Section */}
        <div id='candidates'>
          <CandidateList
            candidates={candidates}
            totalVotes={election.totalVotes}
            isActive={isActive}
            isCompleted={isCompleted}
            onViewProfile={openCandidateDetail}
            onVote={initiateVote}
            address={address}
            isEligible={isEligible}
            hasUserVoted={hasUserVoted}
          />
        </div>

        {/* Election Analytics Section - Only visible when election is active or completed */}
        {(isActive || isCompleted) && (
          <ElectionAnalytics />
        )}

        {/* Blockchain Logs Section - Only visible to admin users */}
        {user?.user_role === 'admin' && (
          <BlockchainLogs 
            contractAddress={address} 
            network="sepolia"
          />
        )}
      </div>

      {/* Candidate Detail Dialog */}
      <CandidateDetailDialog
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={closeCandidateDetail}
        onVote={initiateVote}
        isActive={isActive}
        isCompleted={isCompleted}
        totalVotes={election.totalVotes}
        isEligible={isEligible}
        hasUserVoted={hasUserVoted}
      />

      {/* Vote Confirmation Dialog */}
      <VoteConfirmDialog
        candidate={candidateToVote}
        isOpen={voteDialogOpen}
        onClose={() => setVoteDialogOpen(false)}
        onConfirm={confirmVote}
      />

      {/* Sticky Mobile Action Button */}
      {isActive && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden">
          <Button className="w-full" onClick={() => document.getElementById("candidates").scrollIntoView({ behavior: "smooth" })}>
            View candidates {isEligible ? 'and vote' : ''}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ElectionDetailsPage;
