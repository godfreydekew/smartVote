import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Twitter, Linkedin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useReadContract } from "thirdweb/react";
import { singleElectionContract } from '@/utils/thirdweb-client';

interface CandidateCardProps {
  candidate: {
    id: string;
    name: string;
    position: string;
    photo: string;
    party?: string;
    bio?: string;
    tagline?: string;
    twitter?: string;
    website?: string;
    voteCount?: number;
    winner?: boolean;
  };
  totalVotes: number;
  isCompleted: boolean;
  onViewProfile: (candidate: CandidateCardProps['candidate']) => void;
  onVote: (candidate: CandidateCardProps['candidate']) => void;
  isActive: boolean;
  address: any;
  isEligible: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  totalVotes,
  isCompleted,
  onViewProfile,
  onVote,
  isActive,
  address,
  isEligible,
}) => {
  const singleElection = singleElectionContract(address);

  const { data, isPending } = useReadContract({
    contract: singleElection,
    method:
      "function getCandidatesById(uint256 candidateId) view returns ((uint256 id, string name, uint256 voteCount))",
    params: [BigInt(candidate.id)],
  });

  console.log(data)
  return (
    <Card key={candidate.id} className={`
      overflow-hidden transition-all duration-200 hover:shadow-md
      ${candidate.winner ? 'border-green-500' : ''}
    `}>
      <div className="aspect-video relative">
        <img 
          src={candidate.photo} 
          alt={candidate.name} 
          className="w-full h-full object-cover"
        />

        {candidate.winner && (
          <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-medium">
            Winner
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{candidate.name}</h3>
        <p className="text-gray-500 text-sm">{candidate.position}</p>
        {candidate.party && (
          <p className="text-gray-500 text-sm">{candidate.party}</p>
        )}
        
        {candidate.tagline && (
          <p className="mt-2 text-sm font-medium bg-blue-50 text-blue-700 inline-block px-2 py-0.5 rounded">
            {candidate.tagline}
          </p>
        )}
        
        {/* Social Media Links */}
        <div className="mt-2 flex items-center gap-2">
          <TooltipProvider>
            {candidate.twitter && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={`https://twitter.com/${candidate.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1DA1F2] hover:scale-110 transition-transform p-1 group flex items-center"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>@{candidate.twitter}</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {candidate.website && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={candidate.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:scale-110 transition-transform p-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Official website</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
        
        {isCompleted && !isPending && (
          <p className="mt-2 font-medium">
            Received <span className="text-blue-600">{candidate.voteCount}</span> votes
            <span className="text-gray-500 text-sm ml-1">
              ({Math.round((Number(data.voteCount) / totalVotes) * 100)}%)
            </span>
          </p>
        )}
        
        <div className="mt-4 flex gap-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onViewProfile(candidate)}
          >
            View profile
          </Button>
          
          {isActive && isEligible && (
            <Button 
              className="w-full"
              onClick={() => onVote(candidate)}
              disabled={!isEligible}
            >
              Vote
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
