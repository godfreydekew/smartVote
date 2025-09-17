import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DemographicsChartProps {
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  regionalDistribution: {
    [region: string]: number;
  };
}

export const DemographicsChart: React.FC<DemographicsChartProps> = ({
  genderDistribution,
  regionalDistribution
}) => {
  const genderData = [
    { name: 'Male', value: genderDistribution.male, color: 'hsl(var(--chart-1))' },
    { name: 'Female', value: genderDistribution.female, color: 'hsl(var(--chart-2))' },
    { name: 'Other', value: genderDistribution.other, color: 'hsl(var(--chart-3))' },
  ].filter(item => item.value > 0);

  const regionalData = Object.entries(regionalDistribution).map(([region, count]) => ({
    region,
    count
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label || payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value} voters
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 w-1 bg-analytics-secondary rounded"></div>
            Gender Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {genderData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No gender data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Regional Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 w-1 bg-analytics-success rounded"></div>
            Regional Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {regionalData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="region" 
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
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--chart-3))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No regional data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};