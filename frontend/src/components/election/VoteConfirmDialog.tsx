import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Twitter, Linkedin, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SHA256 } from 'crypto-js';

interface VoteConfirmDialogProps {
  candidate: any | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (proof: any, leaf: any, index: any, nullifier: any) => void;
  publicKey: string;
  secretKey: string;
  electionId: string;
}

const VoteConfirmDialog: React.FC<VoteConfirmDialogProps> = ({
  candidate,
  isOpen,
  onClose,
  onConfirm,
  publicKey,
  secretKey,
  electionId,
}) => {
  if (!candidate) return null;

  const [proof, setProof] = useState<any>(null);
  const [leaf, setLeaf] = useState<any>(null);
  const [index, setIndex] = useState<any>(null);
  const [nullifier, setNullifier] = useState<any>(null);

  const handleConfirm = async () => {
    const leaf = SHA256(publicKey).toString();
    const proof = await getMerkleProof(publicKey);
    const nullifier = SHA256(secretKey + electionId).toString();

    setLeaf(leaf);
    setProof(proof.proof);
    setIndex(proof.index);
    setNullifier(nullifier);

    onConfirm(proof.proof, leaf, proof.index, nullifier);
  };

  const getMerkleProof = async (publicKey: string) => {
    const response = await fetch(`/api/election/merkle-proof/${electionId}/${publicKey}`);
    const data = await response.json();
    return data;
  };

  console.log(candidate);
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm your vote</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={candidate.photo} 
                alt={candidate.name} 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-foreground text-base">
                  You are about to vote for <strong>{candidate.name}</strong> for the position of <strong>{candidate.position}</strong>.
                </p>
                
                {/* Social Links */}
                {candidate && (
                  <div className="flex items-center gap-2 mt-1">
                    <TooltipProvider>
                      {candidate.twitter && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={`https://twitter.com/${candidate.twitter}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#1DA1F2] hover:scale-110 transition-transform"
                            >
                              <Twitter className="h-4 w-4" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>@{candidate.twitter}</span>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {/* {candidate.socialLinks.linkedin && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={`https://linkedin.com/in/${candidate.socialLinks.linkedin}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#0A66C2] hover:scale-110 transition-transform"
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>LinkedIn: {candidate.socialLinks.linkedin}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                       */}
                      {candidate.website && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={candidate.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:scale-110 transition-transform"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>Official website</span>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TooltipProvider>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirm Vote
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VoteConfirmDialog;
