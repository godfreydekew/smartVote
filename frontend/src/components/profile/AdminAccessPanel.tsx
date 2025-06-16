
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, Mail, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AdminAccessPanelProps {
  isAdmin?: boolean;
}

export const AdminAccessPanel = ({ isAdmin = false }: AdminAccessPanelProps) => {
  const [otp, setOtp] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactReason, setContactReason] = useState("");
  const { toast } = useToast();

  const handleVerify = () => {
    if (otp.length === 6) {
      // In a real app, you'd verify the OTP with your backend
      if (otp === "123456") { // Simulated correct OTP
        toast({
          title: "Admin access granted",
          description: "You now have admin privileges on your account.",
        });
        // In a real app, you'd update the user's role in the database
        // and redirect them to the admin dashboard
        window.location.href = '/admin';
      } else {
        toast({
          variant: "destructive",
          title: "Invalid OTP",
          description: "The verification code you entered is incorrect. Please try again.",
        });
      }
    }
  };

  const handleContactSubmit = () => {
    if (contactEmail && contactReason) {
      toast({
        title: "Request submitted",
        description: "Our verification team will contact you shortly.",
      });
      setShowContactForm(false);
      setContactEmail("");
      setContactReason("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Admin Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="mr-3">
            {isAdmin ? (
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-medium">Status:</span>
              {isAdmin ? (
                <Badge className="ml-2 bg-green-100 text-green-700 border-green-200 hover:bg-green-200">
                  Admin
                </Badge>
              ) : (
                <Badge className="ml-2 bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200">
                  Standard User
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {isAdmin 
                ? "You have access to all administrative features"
                : "Request admin privileges for additional features"}
            </p>
          </div>
        </div>

        {isAdmin ? (
          <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>
            Access Admin Dashboard
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                Request Admin Privileges
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {showContactForm ? "Request Admin Access" : "Admin Verification"}
                </DialogTitle>
                <DialogDescription>
                  {showContactForm 
                    ? "Please provide details about why you need admin access."
                    : "Enter the 6-digit verification code to activate admin privileges."}
                </DialogDescription>
              </DialogHeader>

              {showContactForm ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Your Email</Label>
                    <Input
                      id="contact-email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-reason">Reason for Admin Access</Label>
                    <Input
                      id="contact-reason"
                      value={contactReason}
                      onChange={(e) => setContactReason(e.target.value)}
                      placeholder="I need admin access because..."
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowContactForm(false)}>
                      Back
                    </Button>
                    <Button onClick={handleContactSubmit} disabled={!contactEmail || !contactReason}>
                      Submit Request
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <>
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2 items-center">
                      <Label 
                        htmlFor="otp" 
                        className="text-center text-sm text-gray-500"
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
                      onClick={handleVerify}
                      disabled={otp.length < 6}
                      className="w-full"
                    >
                      Verify Code
                    </Button>
                    <div className="pt-2">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="info">
                          <AccordionTrigger className="text-sm text-blue-600 hover:no-underline py-1">
                            <Info className="h-4 w-4 mr-1" />
                            Why admin access is restricted
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-gray-600">
                            Admin access provides elevated privileges for managing elections and user data. 
                            For security purposes, all admin requests are manually reviewed and require 
                            verification through our secure OTP system.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      <button 
                        onClick={() => setShowContactForm(true)}
                        className="text-sm text-blue-600 hover:underline mt-2 flex items-center"
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Don't have an OTP? Contact Verification Team
                      </button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};
