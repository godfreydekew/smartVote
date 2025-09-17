import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye } from 'lucide-react';
import { SecurityStatusBadge } from './SecurityBadges';
import { getTimeAgo, filterAuditLogs } from '@/utils/securityUtils';
import { useTranslation } from 'react-i18next';

/**
 * Individual audit log row component
 */
const AuditLogRow = ({ log, onViewDetails = (auditLog) => {}, t }) => {
  const hasVoteDiscrepancy = log.db_total_votes !== log.chain_total_votes;
  const hasStatusDiscrepancy = log.db_status !== log.chain_status;

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2 px-3 font-medium">{t('adminSecurity.recentActivity.election', { id: log.election_id })}</td>
      <td className="py-2 px-3">
        <SecurityStatusBadge hasDiscrepancy={log.discrepancy_found} />
      </td>
      <td className="py-2 px-3">{log.db_total_votes || 0}</td>
      <td className="py-2 px-3">
        <span className={hasVoteDiscrepancy ? 'text-red-600 font-medium' : ''}>{log.chain_total_votes ?? 'N/A'}</span>
      </td>
      <td className="py-2 px-3">
        <span className="text-sm bg-gray-100 px-2 py-1 rounded">{log.db_status || 'Unknown'}</span>
      </td>
      <td className="py-2 px-3">
        <span
          className={`text-sm px-2 py-1 rounded ${
            hasStatusDiscrepancy ? 'bg-red-100 text-red-600 font-medium' : 'bg-gray-100'
          }`}
        >
          {log.chain_status || 'N/A'}
        </span>
      </td>
      <td className="py-2 px-3 text-sm text-gray-500">{getTimeAgo(log.check_time)}</td>
      <td className="py-2 px-3">
        <Button variant="ghost" size="sm" onClick={() => onViewDetails(log)} className="hover:bg-blue-50">
          <Eye size={14} />
        </Button>
      </td>
    </tr>
  );
};

/**
 * Table header component
 */
const AuditTableHeader = ({ t }) => (
  <thead>
    <tr className="border-b bg-gray-50">
      <th className="text-left py-3 px-3 font-semibold">{t('adminSecurity.auditLogsTable.election')}</th>
      <th className="text-left py-3 px-3 font-semibold">{t('adminSecurity.auditLogsTable.status')}</th>
      <th className="text-left py-3 px-3 font-semibold">{t('adminSecurity.auditLogsTable.dbVotes')}</th>
      <th className="text-left py-3 px-3 font-semibold">{t('adminSecurity.auditLogsTable.chainVotes')}</th>
      <th className="text-left py-3 px-3 font-semibold">{t('adminSecurity.auditLogsTable.dbStatus')}</th>
      <th className="text-left py-3 px-3 font-semibold">{t('adminSecurity.auditLogsTable.chainStatus')}</th>
      <th className="text-left py-3 px-3 font-semibold">{t('adminSecurity.auditLogsTable.checkTime')}</th>
      <th className="text-left py-3 px-3 font-semibold">{t('adminSecurity.auditLogsTable.actions')}</th>
    </tr>
  </thead>
);

/**
 * Empty state for audit logs
 */
const EmptyAuditLogsState = ({ t }) => (
  <tr>
    <td colSpan={8} className="py-8 text-center">
      <div className="flex flex-col items-center">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">{t('adminSecurity.auditLogsTable.noAuditLogsFound')}</p>
        <p className="text-sm text-gray-400">{t('adminSecurity.auditLogsTable.securityMonitoringWillAppear')}</p>
      </div>
    </td>
  </tr>
);

/**
 * Main security audit logs table component
 */
export const SecurityAuditLogsTable = ({
  auditLogs,
  searchTerm,
  selectedElection,
  onViewDetails = (auditLog) => {},
}) => {
  const { t } = useTranslation();
  const filteredLogs = filterAuditLogs(auditLogs, { searchTerm, selectedElection });

  // Show most recent first
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.check_time).getTime() - new Date(a.check_time).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={18} />
          {t('adminSecurity.auditLogsTable.title', { count: filteredLogs.length })}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <AuditTableHeader t={t} />
            <tbody>
              {sortedLogs.length === 0 ? (
                <EmptyAuditLogsState t={t} />
              ) : (
                sortedLogs.map((log) => <AuditLogRow key={log.id} log={log} onViewDetails={onViewDetails} t={t} />)
              )}
            </tbody>
          </table>
        </div>

        {filteredLogs.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              {t('adminSecurity.auditLogsTable.showingResults', {
                showing: Math.min(filteredLogs.length, 50),
                total: filteredLogs.length,
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
