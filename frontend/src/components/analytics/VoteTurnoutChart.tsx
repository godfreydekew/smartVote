import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface VoteTurnoutChartProps {
  totalVotes: number;
  eligibleVoters: number;
  turnoutPercentage: number;
}

export const VoteTurnoutChart: React.FC<VoteTurnoutChartProps> = ({
  totalVotes,
  eligibleVoters,
  turnoutPercentage
}) => {
  const data = [
    {
      name: 'Voted',
      value: totalVotes,
      percentage: turnoutPercentage,
      color: 'hsl(var(--chart-1))'
    },
    {
      name: 'Did Not Vote',
      value: eligibleVoters - totalVotes,
      percentage: 100 - turnoutPercentage,
      color: 'hsl(var(--muted))'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value.toLocaleString()} voters ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-6 w-1 bg-vote-blue rounded"></div>
          Voter Turnout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {totalVotes.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Votes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {eligibleVoters.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Eligible Voters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-vote-blue">
              {turnoutPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Turnout Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};