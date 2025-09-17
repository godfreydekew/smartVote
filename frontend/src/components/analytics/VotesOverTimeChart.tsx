import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { VoteOverTime } from '@/api/services/analyticsService';

interface VotesOverTimeChartProps {
  data: VoteOverTime[];
}

export const VotesOverTimeChart: React.FC<VotesOverTimeChartProps> = ({ data }) => {
  // Transform the data for the chart
  const transformedData = React.useMemo(() => {
    const groupedByHour: { [hour: string]: { [candidate: string]: number } } = {};
    
    data.forEach(item => {
      const hour = new Date(item.hour).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit'
      });
      
      if (!groupedByHour[hour]) {
        groupedByHour[hour] = {};
      }
      
      groupedByHour[hour][item.candidate_name] = item.vote_count;
    });

    return Object.entries(groupedByHour).map(([hour, candidates]) => ({
      hour,
      ...candidates,
    }));
  }, [data]);

  // Get unique candidate names for lines
  const candidateNames = React.useMemo(() => {
    const names = new Set<string>();
    data.forEach(item => names.add(item.candidate_name));
    return Array.from(names);
  }, [data]);

  // Color mapping for candidates
  const getLineColor = (index: number) => {
    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];
    return colors[index % colors.length];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value} votes
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 w-1 bg-vote-blue rounded"></div>
            Votes Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No voting data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-6 w-1 bg-vote-blue rounded"></div>
          Votes Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transformedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="hour" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {candidateNames.map((candidate, index) => (
                <Line
                  key={candidate}
                  type="monotone"
                  dataKey={candidate}
                  stroke={getLineColor(index)}
                  strokeWidth={2}
                  dot={{ fill: getLineColor(index), strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};