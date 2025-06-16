import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, AlertCircle, Copy, Link, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ElectionCreationLoadingProps {
  currentStep: number;
  totalSteps: number;
  status: 'creating' | 'publishing' | 'ready' | 'error';
  error?: string;
  contractAddress?: string;
  transactionHash?: string;
  onReturn?: () => void;
}

export const ElectionCreationLoading: React.FC<ElectionCreationLoadingProps> = ({
  currentStep,
  totalSteps,
  status,
  error,
  contractAddress,
  transactionHash,
  onReturn,
}) => {
  const { toast } = useToast();
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    {
      title: 'Creating Election',
      description: 'Setting up election details and configuration',
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
    },
    {
      title: 'Publishing to Blockchain',
      description: 'Deploying smart contract and recording election data',
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
    },
    {
      title: 'Finalizing',
      description: 'Completing setup and preparing for voting',
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
    },
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied.`,
    });
  };

  const viewOnExplorer = () => {
    if (transactionHash) {
      window.open(
        `https://sepolia.etherscan.io/tx/${transactionHash}`,
        '_blank'
      );
    }
  };

  if (status === 'ready' && contractAddress) {
    return (
      <div className="flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Election Created!</h2>
          <p className="text-gray-500">
            Your election has been successfully created and deployed to the blockchain
          </p>
        </div>

        <Card className="w-full max-w-md mb-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileCheck className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-medium truncate">
                      {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyToClipboard(contractAddress, 'Contract address')}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {transactionHash && (
                <div className="flex items-start gap-3">
                  <FileCheck className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm font-medium truncate">
                        {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => copyToClipboard(transactionHash, 'Transaction hash')}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Link className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Network</p>
                  <p className="font-medium">Sepolia Testnet</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 w-full max-w-md">
          {onReturn && (
            <Button className="w-full" onClick={onReturn}>
              Return to Dashboard
            </Button>
          )}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={viewOnExplorer}
          >
            View on Etherscan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Creating Your Election</h2>
            <p className="text-gray-500">Please wait while we set up your election</p>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCurrentStep = index + 1 === currentStep;
              const isCompleted = index + 1 < currentStep;
              const isError = status === 'error' && isCurrentStep;

              return (
                <div
                  key={index}
                  className={`flex items-start space-x-4 p-4 rounded-lg ${
                    isCurrentStep ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : isError ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                    {isError && error && (
                      <p className="text-sm text-red-500 mt-1">{error}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 