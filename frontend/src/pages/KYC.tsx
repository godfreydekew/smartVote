
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import kycService from '@/api/services/kycService';

const KYC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    if (!isAuthenticated) {
      toast({ title: 'Authentication Required', description: 'Please log in to access this page.', variant: 'destructive' });
      navigate('/login');
    } else if (user?.kyc_verified) {
      toast({ title: 'Already Verified', description: 'Your identity has already been verified.', variant: 'success' });
      navigate('/dashboard');
    }
  }, [user, isAuthenticated, isLoading, navigate, toast]);

  const handleStartVerification = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to start verification.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const data = await kycService.startVerification(user.id);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: 'Error',
          description: 'Could not start KYC verification. Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('KYC verification error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  // Render a loading state or null while checking auth status
  if (isLoading || !isAuthenticated || user?.kyc_verified) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
            <DashboardHeader />
            <div className="flex-1 flex items-center justify-center">Loading...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <DashboardHeader />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
              <ShieldCheck className="w-8 h-8 text-vote-blue" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-vote-blue to-vote-teal bg-clip-text text-transparent">
              Verify Your Identity
            </h2>
            <p className="text-gray-600 text-lg">
              One final step to secure your vote. Identity verification is required for participation in protected elections.
            </p>
          </div>

          <div className="space-y-4 text-left bg-gray-50 p-6 rounded-xl border">
            <div>
              <h3 className="font-semibold text-gray-800">Why is this necessary?</h3>
              <p className="text-gray-600 mt-1">
                Verification ensures fair and transparent elections by preventing fraudulent activity and confirming voter eligibility.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">What you'll need:</h3>
              <p className="text-gray-600 mt-1">
                Please have a valid government-issued ID document ready.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Button 
              onClick={handleStartVerification} 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-vote-blue to-vote-teal hover:opacity-90 transition-all text-white font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>Start Verification</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              onClick={handleSkip} 
              className="w-full h-12 rounded-xl" 
              variant="ghost"
            >
              Skip for Now
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KYC;
