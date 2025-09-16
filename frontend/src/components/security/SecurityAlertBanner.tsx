import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const SecurityAlertBanner = ({ activeBreaches }) => {
  if (activeBreaches === 0) return null;

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <strong>Security Alert:</strong> {activeBreaches} active security breaches detected. Immediate attention
        required.
      </AlertDescription>
    </Alert>
  );
};
