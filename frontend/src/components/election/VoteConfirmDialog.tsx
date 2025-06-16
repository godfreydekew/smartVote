import React from 'react';
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

interface VoteConfirmDialogProps {
  candidate: any | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const VoteConfirmDialog: React.FC<VoteConfirmDialogProps> = ({
  candidate,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!candidate) return null;

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
          <AlertDialogAction onClick={onConfirm}>
            Confirm Vote
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VoteConfirmDialog;
