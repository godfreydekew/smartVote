import React from 'react';
import CandidateCard from './CandidateCard';

interface CandidateListProps {
  candidates: any[];
  totalVotes: number;
  isActive: boolean;
  isCompleted: boolean;
  onViewProfile: (candidate: any) => void;
  onVote: (candidate: any) => void;
  address: any;
  isEligible: boolean;
}

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  totalVotes,
  isActive,
  isCompleted,
  onViewProfile,
  onVote,
  address,
  isEligible,
}) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-6">
        Candidates
        <span className="ml-2 text-gray-500 font-normal">({candidates.length})</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            totalVotes={totalVotes}
            isActive={isActive}
            isCompleted={isCompleted}
            onViewProfile={onViewProfile}
            onVote={onVote}
            address={address}
            isEligible={isEligible}
          />
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
