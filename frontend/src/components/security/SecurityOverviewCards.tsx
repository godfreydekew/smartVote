import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Database, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getTimeAgo } from '@/utils/securityUtils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const cards = [
    {
      title: t('adminSecurity.overviewCards.totalAudits'),
      value: securityStats.totalAudits,
      subtitle: `${securityStats.recentAudits} ${t('adminSecurity.overviewCards.inLast24h')}`,
      icon: Database,
      borderColor: 'border-l-blue-500',
      valueColor: 'text-blue-600',
    },
    {
      title: t('adminSecurity.overviewCards.activeBreaches'),
      value: securityStats.activeBreaches,
      subtitle: `${securityStats.criticalBreaches} ${t('adminSecurity.overviewCards.critical')}`,
      icon: AlertTriangle,
      borderColor: 'border-l-red-500',
      valueColor: 'text-red-600',
    },
    {
      title: t('adminSecurity.overviewCards.resolved'),
      value: securityStats.resolvedBreaches,
      subtitle: t('adminSecurity.overviewCards.securityIncidentsResolved'),
      icon: CheckCircle,
      borderColor: 'border-l-green-500',
      valueColor: 'text-green-600',
    },
    {
      title: t('adminSecurity.overviewCards.lastAudit'),
      value: securityStats.lastAuditTime
        ? getTimeAgo(securityStats.lastAuditTime)
        : t('adminSecurity.overviewCards.never'),
      subtitle: t('adminSecurity.overviewCards.automatedMonitoring'),
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
