import React from 'react';
import CandidateCard from './CandidateCard';
import { useTranslation } from 'react-i18next';

interface CandidateListProps {
  candidates: any[];
  totalVotes: number;
  isActive: boolean;
  isCompleted: boolean;
  onViewProfile: (candidate: any) => void;
  onVote: (candidate: any) => void;
  address: any;
}

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  totalVotes,
  isActive,
  isCompleted,
  onViewProfile,
  onVote,
  address,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-6">
        {t('electionDetails.candidates.title')}
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
          />
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
