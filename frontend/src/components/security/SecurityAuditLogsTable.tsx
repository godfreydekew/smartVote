import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye } from 'lucide-react';
import { SecurityStatusBadge } from './SecurityBadges';
import { getTimeAgo, filterAuditLogs } from '@/utils/securityUtils';

/**
 * Individual audit log row component
 */
const AuditLogRow = ({ log, onViewDetails = (auditLog) => {} }) => {
  const hasVoteDiscrepancy = log.db_total_votes !== log.chain_total_votes;
  const hasStatusDiscrepancy = log.db_status !== log.chain_status;

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2 px-3 font-medium">Election {log.election_id}</td>
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
const AuditTableHeader = () => (
  <thead>
    <tr className="border-b bg-gray-50">
      <th className="text-left py-3 px-3 font-semibold">Election</th>
      <th className="text-left py-3 px-3 font-semibold">Status</th>
      <th className="text-left py-3 px-3 font-semibold">DB Votes</th>
      <th className="text-left py-3 px-3 font-semibold">Chain Votes</th>
      <th className="text-left py-3 px-3 font-semibold">DB Status</th>
      <th className="text-left py-3 px-3 font-semibold">Chain Status</th>
      <th className="text-left py-3 px-3 font-semibold">Check Time</th>
      <th className="text-left py-3 px-3 font-semibold">Actions</th>
    </tr>
  </thead>
);

/**
 * Empty state for audit logs
 */
const EmptyAuditLogsState = () => (
  <tr>
    <td colSpan={8} className="py-8 text-center">
      <div className="flex flex-col items-center">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No audit logs found</p>
        <p className="text-sm text-gray-400">Security monitoring will appear here</p>
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
          Security Audit Logs ({filteredLogs.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <AuditTableHeader />
            <tbody>
              {sortedLogs.length === 0 ? (
                <EmptyAuditLogsState />
              ) : (
                sortedLogs.map((log) => <AuditLogRow key={log.id} log={log} onViewDetails={onViewDetails} />)
              )}
            </tbody>
          </table>
        </div>

        {filteredLogs.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Showing {Math.min(filteredLogs.length, 50)} of {filteredLogs.length} audit logs
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
