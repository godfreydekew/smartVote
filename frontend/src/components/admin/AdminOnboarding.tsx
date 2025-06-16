
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Shield } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface AdminOnboardingProps {
  isAdmin: boolean;
}

export const AdminOnboarding = ({ isAdmin }: AdminOnboardingProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [isContactFormVisible, setIsContactFormVisible] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactReason, setContactReason] = useState('');
  const { toast } = useToast();

  const handleOtpComplete = (value: string) => {
    setOtp(value);
  };

  const handleAdminRequest = () => {
    // In a real app this would send an API request to request admin access
    toast({
      title: "Request Submitted",
      description: "We've received your request for admin access. You'll be contacted shortly.",
    });
    setIsContactFormVisible(false);
    setIsDialogOpen(false);
    setContactEmail('');
    setContactReason('');
  };

  const handleVerifyOtp = () => {
    // In a real app, this would verify the OTP with a backend service
    if (otp === '123456') {
      toast({
        title: "Access Granted",
        description: "Admin privileges have been activated for your account.",
      });
      setIsDialogOpen(false);
      // In a real app, we would refresh user data or update state here
      window.location.href = '/admin'; // Simple redirect for demo purposes
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "The OTP you entered is incorrect. Please try again.",
      });
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
    setIsContactFormVisible(false);
  };

  const toggleContactForm = () => {
    setIsContactFormVisible(!isContactFormVisible);
  };

  return (
    <div className="mb-4">
      <Button 
        onClick={toggleDialog} 
        variant={isAdmin ? "default" : "outline"}
        className="w-full flex items-center justify-center gap-2"
        disabled={isAdmin}
      >
        <Shield className="w-4 h-4" />
        {isAdmin 
          ? "Admin Access Active" 
          : "Become an Admin"}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isContactFormVisible ? "Request Admin Access" : "Admin Verification"}</DialogTitle>
            <DialogDescription>
              {isContactFormVisible 
                ? "Please provide details about why you need admin access."
                : "Enter the one-time password you received to activate admin privileges."}
            </DialogDescription>
          </DialogHeader>
          
          {isContactFormVisible ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input 
                  id="email" 
                  placeholder="you@example.com" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Access</Label>
                <Input 
                  id="reason" 
                  placeholder="I need admin access because..." 
                  value={contactReason}
                  onChange={(e) => setContactReason(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2 items-center">
                <Label 
                  htmlFor="otp" 
                  className="text-center mb-2 text-sm text-gray-500"
                >
                  Enter the 6-digit code
                </Label>
                <InputOTP 
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button 
                onClick={handleVerifyOtp}
                disabled={otp.length < 6}
                className="w-full"
              >
                Verify Code
              </Button>
              <div className="text-center">
                <button 
                  onClick={toggleContactForm}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Don't have a code? Request admin access
                </button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {isContactFormVisible ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsContactFormVisible(false)}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleAdminRequest}
                  disabled={!contactEmail || !contactReason}
                >
                  Submit Request
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
