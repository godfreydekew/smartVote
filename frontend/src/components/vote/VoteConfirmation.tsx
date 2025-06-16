import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, ChevronDown, ChevronUp, Link, Clock, FileCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface Transaction {
  transactionHash: string;
  chain: {
    id: number;
    name: string;
    blockExplorers: {
      name: string;
      url: string;
      apiUrl: string;
    }[];
  };
}

interface VoteConfirmationProps {
  candidateName: string;
  onReturn: () => void;
  transaction: Transaction;
}

const VoteConfirmation = ({ candidateName, onReturn, transaction }: VoteConfirmationProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [receipt, setReceipt] = useState<{
    blockNumber: number;
    gasUsed: string;
  } | null>(null);

  // Simple loading state for vote recording
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulate 3 seconds of processing

    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied.`,
    });
  };

  const viewOnExplorer = () => {
    if (transaction?.chain?.blockExplorers?.[0]?.url) {
      window.open(
        `${transaction.chain.blockExplorers[0].url}/tx/${transaction.transactionHash}`,
        '_blank'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="relative mb-6">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Recording your vote...</h2>
        <p className="text-gray-500 mb-8">Transaction submitted: {transaction.transactionHash.slice(0, 10)}...{transaction.transactionHash.slice(-8)}</p>
        <div className="w-full max-w-xs bg-blue-50 text-blue-700 p-4 rounded-lg">
          <p className="text-sm">
            Voting for <span className="font-semibold">{candidateName}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Vote Recorded!</h2>
        <p className="text-gray-500">
          Your vote for <span className="font-semibold">{candidateName}</span> has been recorded
        </p>
      </div>

      <Card className="w-full max-w-md mb-6 overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileCheck className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Transaction hash</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm font-medium truncate">
                    {transaction.transactionHash.slice(0, 10)}...{transaction.transactionHash.slice(-8)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => copyToClipboard(transaction.transactionHash, 'Transaction hash')}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Link className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Network</p>
                <p className="font-medium">
                  {transaction.chain.name} (ID: {transaction.chain.id})
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 w-full max-w-md">
        <Button className="w-full" onClick={onReturn}>
          Return to Election
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={viewOnExplorer}
        >
          View on Block Explorer
        </Button>
      </div>
    </div>
  );
};

export default VoteConfirmation;