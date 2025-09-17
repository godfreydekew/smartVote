import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ScrollText, CheckCircle2 } from 'lucide-react';

interface ElectionRulesProps {
  rules: string[];
  isActive: boolean;
  isUpcoming: boolean;
}

const ElectionRules: React.FC<ElectionRulesProps> = ({ rules, isActive, isUpcoming }) => {
  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-4 sm:p-6 border-b bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <ScrollText className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Election Rules</h3>
        </div>
      </div>
      <CardContent className="p-4 sm:p-6">
        <ul className="space-y-4">
          {rules.map((rule, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="p-1 rounded-full bg-blue-500/10 mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-gray-700 text-sm sm:text-base">{rule}</span>
            </li>
          ))}
        </ul>

        {isActive && (
          <Alert className="mt-6 bg-blue-50 border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-blue-500/10 mt-0.5">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <AlertDescription className="text-sm text-gray-700">
                Your vote is anonymous and cannot be changed once submitted.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {isUpcoming && (
          <Alert className="mt-6 bg-blue-50 border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-blue-500/10 mt-0.5">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <AlertDescription className="text-sm text-gray-700">
                You can bookmark candidates now and vote when the election begins.
              </AlertDescription>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ElectionRules;
