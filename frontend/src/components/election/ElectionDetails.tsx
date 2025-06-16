import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle2, Users, Clock } from "lucide-react";
import { format, formatDistance } from 'date-fns';

interface ElectionDetailsProps {
  startDate: string | Date;
  endDate: string | Date;
  participants: number;
  totalVotes: number;
  isActive: boolean;
}

const formatDateTime = (date: string | Date) => {
  // Create a new Date object from the input
  const d = new Date(date);
  
  // Format the date in local timezone
  return {
    date: format(d, 'MMM dd, yyyy'),
    time: format(d, 'h:mm a'),
    fullDateTime: format(d, 'MMM dd, yyyy h:mm a'),
    relative: formatDistance(d, new Date(), { addSuffix: true })
  };
};

const ElectionDetails: React.FC<ElectionDetailsProps> = ({
  startDate,
  endDate,
  participants,
  totalVotes,
  isActive
}) => {
  const start = formatDateTime(startDate);
  const end = formatDateTime(endDate);

  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-4 sm:p-6 border-b bg-gray-50/50">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Election Details</h2>
      </div>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Start Date */}
          <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Start Date</p>
              <p className="text-gray-700 text-sm sm:text-base mt-1">
                {start.date} <span className="text-gray-500">at {start.time}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1.5">{start.relative}</p>
            </div>
          </div>
          
          {/* End Date */}
          <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">End Date</p>
              <p className="text-gray-700 text-sm sm:text-base mt-1">
                {end.date} <span className="text-gray-500">at {end.time}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1.5">{end.relative}</p>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Eligible Participants</p>
              <p className="text-gray-700 text-sm sm:text-base mt-1">{participants.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1.5">Registered voters</p>
            </div>
          </div>

          {/* Votes */}
          <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Total Votes Cast</p>
              <p className="text-gray-700 text-sm sm:text-base mt-1">{totalVotes.toLocaleString()}</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ElectionDetails;