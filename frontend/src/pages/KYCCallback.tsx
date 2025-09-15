
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import kycService from '@/api/services/kycService';
import { CheckCircle2, AlertTriangle, Clock, Loader2 } from 'lucide-react';

// Define the structure for the status
interface StatusDisplayInfo {
  icon: React.ReactNode;
  title: string;
  message: string;
  toast: {
    title: string;
    description: string;
    variant: 'success' | 'destructive' | 'default';
  };
  showRedirect: boolean;
}

const statusInfo: { [key: string]: StatusDisplayInfo } = {
  Approved: {
    icon: <CheckCircle2 className="w-10 h-10 text-green-600" />,
    title: 'Verification Complete',
    message: 'Thank you for verifying your identity. You will be redirected to the dashboard.',
    toast: {
      title: 'Verification Successful!',
      description: 'Your identity has been verified.',
      variant: 'success',
    },
    showRedirect: true,
  },
  Rejected: {
    icon: <AlertTriangle className="w-10 h-10 text-red-600" />,
    title: 'Verification Failed',
    message: 'We were unable to verify your identity. Please ensure your documents are clear and valid.',
    toast: {
      title: 'Verification Failed',
      description: 'Please try again or contact support.',
      variant: 'destructive',
    },
    showRedirect: false,
  },
  Pending: {
    icon: <Clock className="w-10 h-10 text-yellow-600" />,
    title: 'Verification Under Review',
    message: 'Your submission is being reviewed. We will notify you once the process is complete.',
    toast: {
      title: 'Verification Pending',
      description: 'Your application is under review.',
      variant: 'default',
    },
    showRedirect: false,
  },
};

const KYCCallback = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sessionId = params.get('sessionId');

    if (!sessionId) {
      toast({ title: 'Error', description: 'No session ID found.', variant: 'destructive' });
      navigate('/dashboard');
      return;
    }

    const checkResult = async () => {
      try {
        const result = await kycService.getVerificationResult(sessionId);
        const currentStatus = result.status || 'Pending';
        setStatus(currentStatus);

        const displayData = statusInfo[currentStatus];
        if (displayData) {
          toast(displayData.toast);
          if (displayData.showRedirect) {
            setTimeout(() => navigate('/dashboard'), 3000);
          }
        }

      } catch (error) {
        setStatus('Rejected');
        toast({ title: 'Error', description: 'Failed to retrieve verification result.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    checkResult();
  }, [search, navigate, toast]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-gray-600 animate-spin mx-auto" />
          <h2 className="text-3xl font-bold text-gray-800">Fetching Verification Result...</h2>
          <p className="text-gray-600 text-lg">Please wait a moment.</p>
        </div>
      );
    }

    const displayData = status ? statusInfo[status] : statusInfo.Rejected;

    return (
      <div className="text-center space-y-4">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-${status === 'Approved' ? 'green' : status === 'Pending' ? 'yellow' : 'red'}-100`}>
          {displayData.icon}
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{displayData.title}</h2>
        <p className="text-gray-600 text-lg">{displayData.message}</p>
        {!displayData.showRedirect && (
          <div className="pt-4">
            <Button asChild>
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <DashboardHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default KYCCallback;
