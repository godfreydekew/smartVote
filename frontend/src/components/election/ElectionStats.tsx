import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, TooltipProps } from 'recharts';
import { Info, TrendingUp, Users } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useReadContract } from 'thirdweb/react';
import { singleElectionContract } from '@/utils/thirdweb-client';
import { motion } from 'framer-motion';

interface ElectionStatsProps {
  address: string;
}

interface ChartData {
  name: string;
  value: number;
  percentage: string;
}

interface CandidateResult {
  id: bigint;
  name: string;
  voteCount: bigint;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartData;
  }>;
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

const COLORS = [
  'rgba(0, 136, 254, 0.8)', // Blue
  'rgba(0, 196, 159, 0.8)', // Teal
  'rgba(255, 187, 40, 0.8)', // Yellow
  'rgba(255, 128, 66, 0.8)', // Orange
  'rgba(136, 132, 216, 0.8)', // Purple
  'rgba(130, 202, 157, 0.8)', // Green
];

const HOVER_COLORS = [
  'rgba(0, 136, 254, 1)', // Blue
  'rgba(0, 196, 159, 1)', // Teal
  'rgba(255, 187, 40, 1)', // Yellow
  'rgba(255, 128, 66, 1)', // Orange
  'rgba(136, 132, 216, 1)', // Purple
  'rgba(130, 202, 157, 1)', // Green
];

export const ElectionStats: React.FC<ElectionStatsProps> = ({ address }) => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const electionContract = singleElectionContract(address);

  // Get sorted results from the smart contract
  const { data: sortedResults, isPending: isResultsPending } = useReadContract({
    contract: electionContract,
    method: 'function getSortedResults() view returns ((uint256 id, string name, uint256 voteCount)[])',
    params: [],
  });

  // Get election details
  const { data: electionData, isPending: isElectionPending } = useReadContract({
    contract: electionContract,
    method:
      'function election() view returns (uint256 id, string title, uint256 startTime, uint256 endTime, uint8 state, bool isPublic, address owner, uint256 totalVotes, bool exists)',
    params: [],
  });

  // Transform the data for the pie chart
  const chartData =
    sortedResults?.map((result: CandidateResult) => ({
      name: result.name,
      value: Number(result.voteCount),
      percentage:
        electionData && Number(electionData[7]) > 0
          ? ((Number(result.voteCount) / Number(electionData[7])) * 100).toFixed(1)
          : '0',
    })) || [];

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 border rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90"
        >
          <p className="font-bold text-lg mb-2 text-gray-900">{payload[0].payload.name}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Votes:</span> {payload[0].value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Percentage:</span> {payload[0].payload.percentage}%
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Rank:</span>{' '}
              {chartData.findIndex((item) => item.name === payload[0].payload.name) + 1}
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: LabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-medium drop-shadow-sm"
      >
        {percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
      </text>
    );
  };

  if (isResultsPending || isElectionPending) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vote-blue"></div>
      </div>
    );
  }

  const totalVotes = electionData ? Number(electionData[7]) : 0;
  const sortedData = [...chartData].sort((a, b) => b.value - a.value);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="mt-8 border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vote-blue to-vote-teal">
              Vote Distribution
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Votes: {totalVotes.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 hover:text-vote-blue transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Visual representation of votes distributed among candidates. Hover over segments for detailed
                    information.
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                  paddingAngle={2}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        activeIndex === index
                          ? HOVER_COLORS[index % HOVER_COLORS.length]
                          : COLORS[index % COLORS.length]
                      }
                      className="transition-all duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value: string) => {
                    const data = sortedData.find((item) => item.name === value);
                    return (
                      <span className="text-sm font-medium text-gray-600">
                        {value} ({data?.percentage}%)
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-vote-blue" />
                <p className="text-sm font-medium text-gray-600">Leading Candidate</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{sortedData[0]?.name}</p>
              <p className="text-sm text-gray-500">{sortedData[0]?.percentage}% of votes</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-vote-teal" />
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{sortedData.length}</p>
              <p className="text-sm text-gray-500">Active in election</p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
