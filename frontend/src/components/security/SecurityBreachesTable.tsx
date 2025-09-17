import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { SeverityBadge, ResolutionStatusBadge } from './SecurityBadges';
import { formatDate, filterBreaches } from '@/utils/securityUtils';
import { useTranslation } from 'react-i18next';

/**
 * Individual breach row component
 */
const BreachRow = ({ breach, onMarkResolved, onViewDetails, t }) => (
  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="font-medium">{t('adminSecurity.recentActivity.election', { id: breach.election_id })}</h3>
          <SeverityBadge issueType={breach.issue_type} />
          <ResolutionStatusBadge resolved={breach.resolved} resolvedAt={breach.resolved_at} />
        </div>

        <p className="text-sm text-gray-600 mb-2">{breach.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{t('adminSecurity.breachesTable.detected', { date: formatDate(breach.detected_at) })}</span>
          <span>{t('adminSecurity.breachesTable.type', { type: breach.issue_type })}</span>
          {breach.resolved_at && (
            <span>{t('adminSecurity.breachesTable.resolved', { date: formatDate(breach.resolved_at) })}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!breach.resolved && (
          <Button size="sm" onClick={() => onMarkResolved(breach.id)} className="bg-green-600 hover:bg-green-700">
            {t('adminSecurity.breachesTable.markResolved')}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onViewDetails(breach)}>
          <Eye size={14} className="mr-1" />
          {t('adminSecurity.breachesTable.details')}
        </Button>
      </div>
    </div>
  </div>
);

/**
 * Empty state component
 */
const EmptyBreachesState = ({ t }) => (
  <div className="text-center py-8">
    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
    <p className="text-gray-500">{t('adminSecurity.breachesTable.noBreachesFound')}</p>
    <p className="text-sm text-gray-400">{t('adminSecurity.breachesTable.systemSecure')}</p>
  </div>
);

/**
 * Main security breaches table component
 */
export const SecurityBreachesTable = ({
  breaches,
  statusFilter,
  setStatusFilter,
  searchTerm,
  onMarkResolved,
  onViewDetails = (breach) => {},
}) => {
  const { t } = useTranslation();
  const filteredBreaches = filterBreaches(breaches, { statusFilter, searchTerm });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={18} />
            {t('adminSecurity.breachesTable.title', { count: filteredBreaches.length })}
          </CardTitle>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('adminSecurity.breachesTable.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('adminSecurity.breachesTable.allBreaches')}</SelectItem>
              <SelectItem value="active">{t('adminSecurity.breachesTable.activeOnly')}</SelectItem>
              <SelectItem value="resolved">{t('adminSecurity.breachesTable.resolvedOnly')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredBreaches.length === 0 ? (
          <EmptyBreachesState t={t} />
        ) : (
          <div className="space-y-3">
            {filteredBreaches.map((breach) => (
              <BreachRow
                key={breach.id}
                breach={breach}
                onMarkResolved={onMarkResolved}
                onViewDetails={onViewDetails}
                t={t}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
