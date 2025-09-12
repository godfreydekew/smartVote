
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CandidateDetailDialogProps {
  candidate: any | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (candidate: any) => void;
  isActive: boolean;
  isCompleted: boolean;
  totalVotes: number;
  isEligible: boolean;
  hasUserVoted: boolean;
}

const CandidateDetailDialog: React.FC<CandidateDetailDialogProps> = ({
  candidate,
  isOpen,
  onClose,
  onVote,
  isActive,
  isCompleted,
  totalVotes,
  isEligible,
  hasUserVoted,
}) => {
  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Candidate Profile</DialogTitle>
        </DialogHeader>
        
        <div className="mt-2">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <img 
              src={candidate.photo} 
              alt={candidate.name} 
              className="w-24 h-24 object-cover rounded-full"
            />
            
            <div>
              <h2 className="text-xl font-bold">{candidate.name}</h2>
              <p className="text-gray-500">{candidate.position}</p>
              {candidate.tagline && (
                <p className="mt-1 text-sm font-medium bg-blue-50 text-blue-700 inline-block px-2 py-0.5 rounded">
                  {candidate.tagline}
                </p>
              )}
              
              {/* Social Media Links */}
              {candidate && (
                <div className="mt-2 flex items-center gap-3">
                  <TooltipProvider>
                    {candidate?.twitter && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a 
                            href={`https://twitter.com/${candidate?.twitter}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#1DA1F2] hover:scale-110 transition-transform p-1 flex items-center"
                          >
                            <Twitter className="h-5 w-5" />
                            {candidate?.verified && (
                              <span className="ml-0.5 bg-blue-500 rounded-full w-2 h-2 block"></span>
                            )}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>@{candidate?.twitter}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    
                    {candidate?.linkedin && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a 
                            href={`https://linkedin.com/in/${candidate?.linkedin}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#0A66C2] hover:scale-110 transition-transform p-1"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>LinkedIn: {candidate?.linkedin}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    
                    {candidate?.website && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a 
                            href={candidate?.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:scale-110 transition-transform p-1"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Official website</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Biography</h3>
              <p className="mt-1 text-gray-700">{candidate.bio}</p>
            </div>
            
            {/* <div>
              <h3 className="font-semibold text-lg">Manifesto</h3>
              <p className="mt-1 text-gray-700">{candidate.manifesto}</p>
            </div> */}
{/*             
            {isCompleted && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">
                  Received <span className="text-blue-600">{candidate.votes}</span> votes
                  <span className="text-gray-500 ml-1">
                    ({Math.round((candidate.votes / totalVotes) * 100)}%)
                  </span>
                </p>
              </div>
            )} */}
          </div>
          
          {isActive && isEligible && !hasUserVoted && (
            <div className="mt-6">
              <Button 
                onClick={() => onVote(candidate)} 
                className="w-full"
                disabled={!isEligible || hasUserVoted}
              >
                Vote for {candidate.name}
              </Button>
            </div>
          )}
          {isActive && hasUserVoted && (
            <div className="mt-6">
              <Button 
                className="w-full"
                disabled
              >
                Voted
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailDialog;
