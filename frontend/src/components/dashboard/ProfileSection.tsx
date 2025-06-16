
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Award, ChevronRight, User } from 'lucide-react';

interface ProfileSectionProps {
  upcomingElections?: number;
}

export const ProfileSection = ({ upcomingElections = 3 }: ProfileSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <User className="mr-2 h-5 w-5 text-vote-blue" />
          Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-vote-lightBlue flex items-center justify-center mr-3">
            <span className="text-lg font-semibold text-vote-blue">JD</span>
          </div>
          <div>
            <h3 className="font-medium">John Doe</h3>
            <p className="text-sm text-gray-500">john.doe@example.com</p>
          </div>
        </div>
        
        <div className="space-y-3 my-4">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Active Elections</span>
            </div>
            <Badge variant="outline" className="bg-white">6</Badge>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <Award className="h-4 w-4 text-vote-blue mr-2" />
              <span className="text-sm">Participation Rate</span>
            </div>
            <Badge variant="outline" className="bg-white">92%</Badge>
          </div>
        </div>
        
        {upcomingElections > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-2">You have {upcomingElections} upcoming elections</p>
            <Button 
              variant="outline" 
              className="w-full justify-between" 
              onClick={() => navigate('/profile')}
            >
              View Profile
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
