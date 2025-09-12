import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Users, Calendar, CheckCircle, XCircle, Globe, Lock, Mail, ShieldCheck, User, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ElectionDetailsProps {
  startDate: Date;
  endDate: Date;
  participants: number;
  totalVotes: number;
  isActive: boolean;
  type: 'public' | 'private' | 'invite-only';
  kycRequired?: boolean;
  ageRestriction?: [number, number];
  regions?: string[];
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

const ElectionDetails = ({
  startDate,
  endDate,
  participants,
  totalVotes,
  isActive,
  type,
  kycRequired,
  ageRestriction,
  regions,
}: ElectionDetailsProps) => {
  const formattedStartDate = formatDateTime(startDate);
  const formattedEndDate = formatDateTime(endDate);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Election Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{formattedStartDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{formattedEndDate}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Participants</p>
              <p className="font-medium">{participants}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total Votes</p>
              <p className="font-medium">{totalVotes}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Election Type & Eligibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              {type === 'public' && <Globe className="h-5 w-5 text-blue-500" />}
              {type === 'private' && <Lock className="h-5 w-5 text-red-500" />}
              {type === 'invite-only' && <Mail className="h-5 w-5 text-yellow-500" />}
              <div>
                <p className="text-sm text-muted-foreground">Election Type</p>
                <p className="font-medium capitalize">{type} Election</p>
              </div>
            </div>

            {kycRequired !== undefined && (
              <div className="flex items-center space-x-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">KYC Required</p>
                  <p className="font-medium">{kycRequired ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}

            {ageRestriction && ageRestriction.length === 2 && (
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Age Restriction</p>
                  <p className="font-medium">{ageRestriction[0]} - {ageRestriction[1]} years old</p>
                </div>
              </div>
            )}

            {regions && regions.length > 0 && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Eligible Regions</p>
                  <div className="flex flex-wrap gap-1">
                    {regions.map((region) => (
                      <Badge key={region} variant="secondary">{region}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectionDetails;
