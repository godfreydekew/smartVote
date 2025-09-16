import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Database, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getTimeAgo } from '@/utils/securityUtils';

/**
 * Individual security metric card
 */
const SecurityMetricCard = ({ title, value, subtitle, icon: Icon, borderColor, valueColor }) => (
  <Card className={`border-l-4 ${borderColor}`}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${valueColor.replace('text-', 'text-').replace('-600', '-500')}`} />
      </div>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </CardContent>
  </Card>
);

/**
 * Main security overview cards grid
 */
export const SecurityOverviewCards = ({ securityStats }) => {
  const cards = [
    {
      title: 'Total Audits',
      value: securityStats.totalAudits,
      subtitle: `${securityStats.recentAudits} in last 24h`,
      icon: Database,
      borderColor: 'border-l-blue-500',
      valueColor: 'text-blue-600',
    },
    {
      title: 'Active Breaches',
      value: securityStats.activeBreaches,
      subtitle: `${securityStats.criticalBreaches} critical`,
      icon: AlertTriangle,
      borderColor: 'border-l-red-500',
      valueColor: 'text-red-600',
    },
    {
      title: 'Resolved',
      value: securityStats.resolvedBreaches,
      subtitle: 'Security incidents resolved',
      icon: CheckCircle,
      borderColor: 'border-l-green-500',
      valueColor: 'text-green-600',
    },
    {
      title: 'Last Audit',
      value: securityStats.lastAuditTime ? getTimeAgo(securityStats.lastAuditTime) : 'Never',
      subtitle: 'Automated monitoring',
      icon: Clock,
      borderColor: 'border-l-yellow-500',
      valueColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <SecurityMetricCard key={index} {...card} />
      ))}
    </div>
  );
};
