
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, ArrowRight } from 'lucide-react';

const KYCNotification = () => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 via-white to-teal-50 border-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-inner">
              <ShieldAlert className="w-6 h-6 text-vote-blue" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Identity Verification Required</h3>
              <p className="text-sm text-gray-600 mt-1">Complete a one-time identity check to vote in secured elections.</p>
            </div>
          </div>
          <Button asChild className="bg-gradient-to-r from-vote-blue to-vote-teal text-white shadow-md hover:opacity-90 transition-opacity flex-shrink-0">
            <Link to="/kyc" className="flex items-center gap-2">
              <span>Verify Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KYCNotification;
